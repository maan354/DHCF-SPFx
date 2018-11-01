import * as React from 'react';
import styles from './DhcFfaq.module.scss';
import { SearchBox } from 'office-ui-fabric-react';
import { IDhcFfaqProps } from './IDhcFfaqProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IFAQState } from './IFAQState'
import { FAQelement } from './FAQelement'
import { LeftPanel } from './LeftPanel'

export default class DhcFfaq extends React.Component<IDhcFfaqProps, any> {

  private _initialState: IFAQState = {
    data: [],
    search: '',
    loading: true,
    filterOptions: [],
    filterOptions2: [],
    filters: [],
    sub_filters: []
  };

  constructor(props: IDhcFfaqProps) {
    super(props);
    this.state = this._initialState;
    this._updateFilters = this._updateFilters.bind(this);
    this._updateSubs = this._updateSubs.bind(this);  
    this._onSearchClear = this._onSearchClear.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this.updateFAQ = this.updateFAQ.bind(this);
    this.doVote = this.doVote.bind(this);
    
  }

  public componentDidMount() {
    this.init();
  }



  private init() {
    this.setState({
      loading: true
    }, () => {
      this.getFAQs(this.props.context)
        .then(data => {
          const _topics = this.getTopics(data.value);
          const _subtopics = this.getSubtopics(data.value);
          this.setState({
            data: data.value,
            loading: false,
            filterOptions: _topics,
            filterOptions2: _subtopics
          });
          console.log(this.state);
        })
        .catch((error: any) => console.error(error));
    });

  }

  private trimedSub;

  

  public render(): React.ReactElement<IDhcFfaqProps> {

    const local_filters = new Set(this.state.filters);
    const local_subs = new Set(this.state.sub_filters);
    let filtered_users = [];
   // const data = this.state.data

    if (this.props.allProps.featured) {
      this.state.data.filter(o => {
        if (o.Title_x0020__x0028_Question_x002.includes(this.props.allProps.ItemsDropDown1) ||
            o.Title_x0020__x0028_Question_x002.includes(this.props.allProps.ItemsDropDown2) ||
            o.Title_x0020__x0028_Question_x002.includes(this.props.allProps.ItemsDropDown3)) {
          filtered_users.push(o);
        }
      })
    }
    else {

      if (local_filters.size !== 0) {
        this.state.data.filter(o => {
          if (local_filters.has(o.Title) || local_filters.has(o.Subtopic)) {
            filtered_users.push(o);
          }
        })
        this.trimedSub = this.trimSubtopics(filtered_users);
      }
      else {
        filtered_users = this.state.data;
        this.trimedSub = null;
      }

      if (local_subs.size !== 0) {

        let trimed_data = filtered_users.filter(o =>
          local_subs.has(o.Subtopic)
        )
        filtered_users = trimed_data
        console.log(trimed_data)
      }
      else {
        filtered_users = filtered_users
      }

      if (this.state.search) {
        let theusers = filtered_users.filter(o =>
          o.Answer.toLowerCase().includes(this.state.search.toLowerCase()) ||
          o.Title_x0020__x0028_Question_x002.toLowerCase().includes(this.state.search.toLowerCase())
        )
        filtered_users = theusers;
      }
      else {
        filtered_users = filtered_users;
      }

    }

    
    let QAs = filtered_users.map((_QA: any, i): JSX.Element => {
      return (
        <div className={"FAQdiv" + i }>        
        <FAQelement
          data = {_QA}
          handleVote = {this.doVote}/>
      </div>
      )
    })
    
    let _markup;
    console.log(this.props.allProps)
    if (this.props.allProps.featured) {
      _markup = (
        <div className="App">
          
           
            {this.props.allProps.adjust ? (
              <div className="news-title-container">
               <span className="news-title">Featured FAQs</span>
              <hr className="divider-right" />
              </div>
            ) : (
              <div className="news-title-container">
              <span className="news-title-left">Featured FAQs</span>
              <hr className="divider" />
              </div>
            )}            
          
          {QAs}
        </div>
      )
    }
    else {
      _markup = (
        <div className="App">
        <LeftPanel data={this.state.filterOptions} data2={this.trimedSub || this.state.filterOptions2} updateSubs={this._updateSubs} updateChecks={this._updateFilters} />
        <div className={styles.right_panel}>
          <SearchBox
            placeholder="Search FAQs"
            onChange={this._onSearch}
            onEscape={this._onSearchClear}
            onClear={this._onSearchClear}
            value={this.state.search}
            disabled={this.state.loading}
          />
          {QAs}
        </div>
      </div>
      )
    }

    return (
      <div className="AppWrapper">
      {_markup}
      </div>
    );
  }

  private doVote(vote,info) {
    let data:string = JSON.stringify({
      'VoteUP': vote
    });
    this.updateFAQ(info,data);
  }

  private _onSearch(search: string = ''): void {
    this.setState({ search: search });
  }

  private _onSearchClear(): void {
    this._onSearch();
  }

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
        console.log(this.state.filters)        
      }    
  }

  public _updateSubs(current, e): void {   
    if (current === null) 
      this.setState({ sub_filters: [] })
    else if (current) {
        let array = this.state.sub_filters
        const index = array.indexOf(current);
        if (index == -1) {
          array.push(current);
        }
        else {
          array.splice(index, 1);
        }
        this.setState({
          sub_filters: array
        });
        console.log(this.state.sub_filters)        
      }    
  }

  private getFAQs(_context): Promise<any> {
      let url:string = _context.pageContext.web.serverRelativeUrl + `/_api/lists/GetByTitle('FAQ')/items`;
      //let url:string = `https://dcgovict.sharepoint.com/sites/dhcf/it/_api/lists/GetByTitle('FAQ - List')/items`;
      return _context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private updateFAQ(id,data) {
    this.props.context.spHttpClient.post(this.props.context.pageContext.web.serverRelativeUrl + `/_api/lists/GetByTitle('FAQ')/items(${id})`,
    SPHttpClient.configurations.v1,  
    {  
      headers: {  
        'Accept': 'application/json;odata=nometadata',  
        'Content-type': 'application/json;odata=nometadata',  
        'odata-version': '',  
        'IF-MATCH': '*',  
        'X-HTTP-Method': 'MERGE'  
      },  
      body: data  
    }).then((response: SPHttpClientResponse): void => {  
      console.log(`Item with ID: ${id} successfully updated`);  
    }, (error: any): void => {  
      console.log(`Error updating item: ${error}`);  
    });  
  }

  private getTopics(data) {
    return Array.from(new Set(data.map(item => item.Title))).sort();
  }

  private getSubtopics(data) {
    return Array.from(new Set(data.map(item => item.Subtopic))).sort();
  }

  private trimSubtopics(data) {
    let _subtopics = Array.from(new Set(data.map(item => item.Subtopic))).sort();
    return _subtopics  
  }

  


}
