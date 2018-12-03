import * as React from 'react';
import * as ReactDom from 'react-dom';
import styles from './EmployeeDirectory.module.scss';
import { Checkbox, ICheckboxProps, Toggle } from 'office-ui-fabric-react';



export class LeftPanel extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = { showall: false };
    this.state = { showalladmins: false };
    this.state = { showalltitles: false };
    this.state = { selectallAdmins: true };
    this.state = { isChecked: true }
    this.deselectAllAdmins = this.deselectAllAdmins.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.showMore = this.showMore.bind(this);
    this.showMoreAdmins = this.showMoreAdmins.bind(this);
    this.showMoreTitles = this.showMoreTitles.bind(this);
  }

  private CheckedBoxes = [];
  /**** liftin' state up */
  handleChange(current, e) {

    const index = this.CheckedBoxes.indexOf(current);
    if (index === -1) {
      this.CheckedBoxes.push(current);
    }
    else {
      this.CheckedBoxes.splice(index, 1);
    }
    this.setState({ isChecked: false });
    this.props.updateChecks(current, e);
    this.setState({ selectAllAdmins: false });
    ReactDom.findDOMNode(this).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  handleChange2(current, e) {

    const index = this.CheckedBoxes.indexOf(current);
    if (index === -1) {
      this.CheckedBoxes.push(current);
    }
    else {
      this.CheckedBoxes.splice(index, 1);
    }
    this.setState({ isChecked: false });
    this.props.updateChecks2(current, e);
    this.setState({ selectAllAdmins: false });
    ReactDom.findDOMNode(this).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  isChecked(label: string): boolean {
    const index = this.CheckedBoxes.indexOf(label);
    if (index === -1) {
      return false;
    }
    else {
      return true;
    }

  }

  showMore() {
    this.setState(state => ({ showall: !state.showall }));
    ReactDom.findDOMNode(this).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  showMoreAdmins() {
    this.setState(state => ({ showalladmins: !state.showalladmins }));
  }

  showMoreTitles() {
    this.setState(state => ({ showalltitles: !state.showalltitles }));
    document.getElementById("Titles123").scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  deselectAllAdmins() {

    if (this.CheckedBoxes.length == 0) {
        this.CheckedBoxes = this.props.data.slice();
        this.setState({ isChecked: false });
        let item;
        let obj;
        for (item = 0; item < this.CheckedBoxes.length; item++) {
          obj = { admin: this.CheckedBoxes[item] }
          this.props.updateChecks(obj);
        }
    }
    else {
      this.CheckedBoxes = [];
      this.setState({ isChecked: true });
      this.props.updateChecks(null);
    }
  }


  render() {
    const admins = this.props.data.map((admin: string, index): JSX.Element => {
      if (admin && (index < 12 || this.state.showall)) {
        return (
          <div>
            <Checkbox checked={this.isChecked(admin)} label={admin.substring(0, 30)} onChange={(e) => this.handleChange(admin, e)} />
          </div>
        );
      }
      else if (admin && index == 12) {
        return (
          <div> <p className="showmoreadmins" onClick={(e) => this.showMore()}>show more</p></div>
        )
      }
      if (this.state.showall) return (<div> <p className="showlessadmins"onClick={(e) => this.showMore()}>show less</p></div>)

    })


    const titles = this.props.data1.map((title: string, index): JSX.Element => {
      if (title && (index < 12 || this.state.showalltitles)) {
        return (
          <div>
            <Checkbox checked={this.isChecked(title)} label={title.substring(0, 30)} onChange={(e) => this.handleChange2(title, e)} />
          </div>
        );
      }
      else if (title && index == 12) {
        return (
          <div> <p className="showmoretitles" onClick={(e) => this.showMoreTitles()}>show more</p></div>
        )
      }
      if (this.state.showalltitles) return (<div> <p className="showlesstitles" onClick={(e) => this.showMoreTitles()}>show less</p></div>)

    })


    return (
    <div className={styles.leftpanel}>     
      <div id="Adminis123" className="Administrations">
      <div className="selectAll">  <Toggle checked={this.state.isChecked} label="Display All" onText="On" offText="Off" onChanged={this.deselectAllAdmins} />  </div>
        <h3> ADMINISTRATIONS</h3>       
        {admins}
      </div>
      <div id="Titles123" className="Titles">        
        <h3> JOB TITLES </h3>
        {titles}
      </div>
    </div>
    );
  }
}