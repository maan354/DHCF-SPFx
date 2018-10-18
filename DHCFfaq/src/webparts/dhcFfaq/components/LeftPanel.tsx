import * as React from 'react';
import * as ReactDom from 'react-dom';
import styles from './DhcFfaq.module.scss';
import { Checkbox, ICheckboxProps, Toggle } from 'office-ui-fabric-react';



export class LeftPanel extends React.Component<any, any> {

  constructor(props) {
    super(props);
 
    this.state = { showalladmins: false };
    this.state = { isChecked: true }
    this.deselectAllAdmins = this.deselectAllAdmins.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  private CheckedBoxes = [];
  /**** liftin' state up */
  handleChange(current, e) {
    console.log(current);  
    const index = this.CheckedBoxes.indexOf(current.topic);
    if (index === -1) {
      this.CheckedBoxes.push(current.topic);
    }
    else {
      this.CheckedBoxes.splice(index, 1);
    }
    this.setState({ isChecked: false });
    this.props.updateChecks(current, e);
    this.setState({ selectAllAdmins: false });    
  }

  handleChange2(current, e) {
    console.log(current);
      
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

  

  isChecked(label: string): boolean {
    const index = this.CheckedBoxes.indexOf(label);
    if (index === -1) {
      return false;
    }
    else {
      return true;
    }

  }

  deselectAllAdmins() {
    if (this.CheckedBoxes.length == 0) {
      this.CheckedBoxes = this.props.data.slice();
      this.setState({ isChecked: false });
      let item;
      let obj;
      for (item = 0; item < this.CheckedBoxes.length; item++) {
        obj = { topic: this.CheckedBoxes[item] }
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
    const topics = this.props.data.map((topic: string, index): JSX.Element => {
      
        return (
          <div>
            <Checkbox checked={this.isChecked(topic)} label={topic.substring(0, 35)} onChange={(e) => this.handleChange2(topic, e)} />
          </div>
        )

    })

    const subtopics = this.props.data2.map((subtopic: string, index): JSX.Element => {
      
      return (
        <div>
          <Checkbox checked={this.isChecked(subtopic)} label={subtopic.substring(0, 35)} onChange={(e) => this.handleChange2(subtopic, e)} />
        </div>
      )

  })


    return (
      <div className={styles.leftpanel}>
        <div className="selectAll">  <Toggle checked={this.state.isChecked} label="Display All" onText="On" offText="Off" onChanged={this.deselectAllAdmins} />  </div>
        <div id="Topics123" className="Topics">
          <h3> TOPICS</h3>
          {topics}
        </div>
        <div id="Subtopics123" className="Subtopics">
          <h3> SUBTOPICS</h3>
          {subtopics}
        </div>
      </div>
    );
  }
}