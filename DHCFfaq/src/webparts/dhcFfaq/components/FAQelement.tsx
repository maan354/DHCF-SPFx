import * as React from 'react';
import { IFAQelementProps } from './IFAQelement'
import styles from './DhcFfaq.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import AnimateHeight from 'react-animate-height';


export class FAQelement extends React.Component<IFAQelementProps,any> {

    constructor(props) {
        super(props);
        this.state = { showDetails: false,
                       height: 0   }
        this.DisplayDetails = this.DisplayDetails.bind(this);
        
    }
        

    private DisplayDetails() {
        this.setState(state => ({ 
          showDetails: !state.showDetails,
          height: state.height == 0 ? 'auto' : 0    
        }));          
    }
    

    render() {


      
      return (

  
        <div className= {"FAQElement " + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>                
          <div className={"Question "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>
            <h2 onClick={this.DisplayDetails}> 
              {this.state.showDetails ? (<FontAwesomeIcon icon={faAngleDown} /> ) : (<FontAwesomeIcon icon={faAngleRight} />)}
              {this.props.data.Title_x0020__x0028_Question_x002}  
            </h2>    
          </div>
          <AnimateHeight
          duration={ 500 }
          height={ this.state.height }
          easing= { 'ease-out' }
        >
          <div className={"Answer "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>   
            <span> {this.props.data.Answer}   </span>
            <div className="AnswerVotes"> 
                <div className="FeedBack">
                  Was it helpful? 
                  <div className='VoteUp' onClick={(e) => this.props.handleVote((this.props.data.VoteUP + 1), this.props.data.Id)}>
                    <FontAwesomeIcon icon={faThumbsUp}/>
                  </div>
                  <div className='VoteDown' onClick={(e) => this.props.handleVote((this.props.data.VoteUP - 1), this.props.data.Id)}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </div>
                </div>               
            </div>
            <div className="devider"></div>
          </div>
          </AnimateHeight>             
        </div>
        

        )
      ;}
    }