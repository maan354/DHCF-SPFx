import * as React from 'react';
import { escape, chunk, sortBy } from '@microsoft/sp-lodash-subset';
import {
  Spinner,
  SpinnerSize,
  SearchBox,
  Overlay,
} from 'office-ui-fabric-react';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './EmployeeDirectory.module.scss';
import { IEmployeeDirectoryProps } from './IEmployeeDirectoryProps';
import { IEmployeeDirectoryState } from './IEmployeeDirectoryState';
import { IUserItem } from './IUserItem';
import { LeftPanel } from './LeftPanel';
import { DHCFPersona } from './DHCFPersona';



export default class EmployeeDirectory extends React.Component<IEmployeeDirectoryProps, IEmployeeDirectoryState> {

  private _initialState: IEmployeeDirectoryState = {
    users: [],
    search: '',
    loading: true,
    _columns: 3,
    filterOptions: [],
    titleOptions: [],
    filters: []
  };

  constructor(props: IEmployeeDirectoryProps) {
    super(props);

    this.state = this._initialState;

    this._onSearchClear = this._onSearchClear.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this.setColumns = this.setColumns.bind(this);
    this._updateFilters = this._updateFilters.bind(this);

  }

  public componentWillReceiveProps(props: IEmployeeDirectoryProps) {
    this.resetState();
  }

  public componentDidMount() {
    this.init();
  }



  private init() {
    this.setState({
      loading: true
    }, () => {
      this.getUsers(this.props.context)
        .then(users => {
          /**** collin' method which returns array of administrations */
          const _admins = this.getAdmins(users.value);
          const _titles = this.getTitles(users.value);
          this.setState({
            users: users.value,
            loading: false,
            filterOptions: _admins,
            titleOptions: _titles
          });
        })
        .catch((error: any) => console.error(error));
       if (this.props.useGraph) 
          this.getGraphUsers();
    });

    this.setColumns();

  }

  /**** func to set number of columns. Use screen size as a parameter */
  private setColumns():void {
    const width = document.documentElement.clientWidth;
    if (width > 1345)
      this.setState({ _columns: 3 });
    else if (width > 1025)
      this.setState({ _columns: 2 });
    else
      this.setState({ _columns: 1 });

  }

  private trimedTitles;

  public render(): React.ReactElement<IEmployeeDirectoryProps> {

    console.log(this.state.filters);

    /**** on resize set number of columns  */
    window.onresize = this.setColumns;


    const local_filters = new Set(this.state.filters);
    let mychunk;
    let filtered_users = [];    

    /****  filters users by selected checkboxes */
    if (local_filters.size !== 0) {
      this.state.users.filter(o => {
        if (local_filters.has(o.Office) || local_filters.has(o.JobTitle)) {
          filtered_users.push(o);
        }
      })
      this.trimedTitles = this.trimTitels(filtered_users);
    }
    else {
      filtered_users = this.state.users;
      this.trimedTitles = null;
    }


    /**** filter users by search string */
    if (this.state.search) {
      let theusers = filtered_users.filter(o =>
        o.FirstName.toLowerCase().includes(this.state.search) ||
        o.LastName.toLowerCase().includes(this.state.search)
      )

      /**** spliting users by number of columns */
      mychunk = chunk(theusers, this.state._columns);
    }
    else {
      mychunk = chunk(filtered_users, this.state._columns);
    }

    let users = mychunk.map((usersChunk: any[], i): JSX.Element => {
      return (
        <div className={styles.employeeGridRow}>
          {
            usersChunk.map((user: IUserItem): JSX.Element => {
              return (
                <div key={user.Id} className={styles.employeeGridCol} style={{ width: 72.72 / this.state._columns + '%' }}>                 
                  <DHCFPersona
                    userPhoto={"https://dcgovict.sharepoint.com/sites/dhcf/_layouts/15/userphoto.aspx?size=L&accountname=" + user.SipAddress}
                    userName={user.FirstName + ' ' + user.LastName}
                    userTitle={user.JobTitle}
                    userDept={user.Office} 
                    userWorkPhone={user.WorkPhone}
                    userMobilePhone={user.MobilePhone}
                    userDepartment={user.Department}
                    userEmail={user.EMail}
                     />
                </div>
              );
            })
          }
        </div>
      );
    });

    return (

    
      <div className={styles.employeeDirectory}>
        {/**** initialising left panel with filterOptions object and a method as a props */}
        <LeftPanel data={this.state.filterOptions} data1={this.trimedTitles || this.state.titleOptions} updateChecks={this._updateFilters} />
        <div className={styles.rightpanel}>
        
          <SearchBox
            className={styles.search}
            placeholder="Search Employees"
            onChange={this._onSearch}
            onEscape={this._onSearchClear}
            onClear={this._onSearchClear}
            value={this.state.search}
            disabled={this.state.loading}
          />

          <div className={styles.employeeGrid}>

            {

             (this.state.users.length > 0) ?
                users
                 :
                (this.state.search && !this.state.loading) && (
                  <div className="ms-textAlignCenter">No employees found.</div>
                )

            }
       
            {
              (this.state.loading) && (
                <Overlay>
                  <Spinner
                    size={SpinnerSize.large}
                    ariaLive='assertive'
                  />
                </Overlay>
              )
            }
          
          </div>
        </div>
      </div>
    );
  }


  private resetState(): void {
    this.setState(this._initialState, () => {
      this.init();
    });
  }

  private _onSearch(search: string = ''): void {
    this.setState({ search: search });
  }

  private _onSearchClear(): void {
    this._onSearch();
  }




  /**** update state with checked checkboxes */
  public _updateFilters(current, e): void {
    if (current === null) 
      this.setState({ filters: [] })
    else if (current) {
        let array = this.state.filters
        const index = array.indexOf(current);
        if (index == -1) {
          array.push(current);
        }
        else {
          array.splice(index, 1);
        }
        this.setState({
          filters: array
        });
      }   
  }


  private getUsers(_context): Promise<any> {
    let url = _context.pageContext.web.absoluteUrl + `/_api/web/siteuserinfolist/items?$top=2000&$select=
                                                  Title,Department,JobTitle,Office,EMail,Id,SipAddress,Picture,FirstName,LastName,WorkPhone,MobilePhone`;
    let filter: string = `&$filter=EMail ne null and UserName ne null`;
    let exclude: string[] = this.props.exclude ? this.props.exclude.split('\n') : [];
    let orderby: string = `&$orderby=` + this.props.sortBy + ` asc`
    if (exclude.length > 0) {
      exclude.map((name: string) => {
        filter += ` and EMail ne '${name}'`;
      });
    }
    url = url + filter + orderby;
    return _context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private getGraphUsers(): Promise<any> {
    if (!this.props.graphClient) {
      return;
    }

    this.props.graphClient
      .api("users")
      .version("v1.0")
   //   .select("bodyPreview,receivedDateTime,from,subject,webLink")
   //   .top(5)
   //   .orderby("receivedDateTime desc")
      .get((err: any, res: any): void => {
        if (err) {
          // Something failed calling the MS Graph          
          console.log("error: ", err.message);                      
          return;
        }

        // Check if a response was retrieved
        if (res && res.value && res.value.length > 0) {
          console.log(res);
        }
        else {
          // No messages found
          console.log("Nada!")
        }
      });

  }

  private getAdmins(_users) {
    return Array.from(new Set(_users.map(item => item.Office))).sort();
  }

  private getTitles(_users) {
    return Array.from(new Set(_users.map(item => item.JobTitle))).sort();
  }

  private trimTitels(data) {
    let _subtopics = Array.from(new Set(data.map(item => item.JobTitle))).sort();
    return _subtopics  
  }

}

