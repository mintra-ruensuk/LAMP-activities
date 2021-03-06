/**
 * @file   Balloon.tsx
 * @brief  Balloon component which is the initial point of Balloon game
 * @date   Apr , 2020
 * @author ZCO Engineer
 * @copyright (c) 2020, ZCO
 */

import * as React from 'react';
import '././style.css';

import BalloonHeader from './BalloonHeader';
import BallonStandSVG from './BallonStandSVG';
import BallonImageSVG from './BallonImageSVG';
import TimerComponent from './TimerComponent';

interface AppState {
    balloon_width: any;
    balloon_number: any;
    new_current_point: any;
    total_points:any;
    btn_pump_disabled: any;
    collected_points: any;
    break_points_array: any;
    btn_collect_disabled: any;
    cls_btn_collect_disabled: any;
    balloon_burst: boolean;
    cls_balloon_burst: any;    
    start: boolean,
    stop: boolean,
    stop_timer: boolean,
} 

class Balloons extends React.Component<{}, AppState> 
{
  constructor(props:any) {
    super(props);
    let break_points_data = this.generateBreakPoints().sort((a,b) => 0.5 - Math.random());
    this.state = {
                  balloon_width:  100,
                  balloon_number : 1,
                  new_current_point : 0,
                  total_points : 0,
                  btn_pump_disabled: null,
                  collected_points: [],
                  break_points_array: break_points_data,
                  btn_collect_disabled: "disabled",
                  cls_btn_collect_disabled: "opacity_05",
                  balloon_burst: false,
                  cls_balloon_burst: null,                              
                  start: false,
                  stop: false,
                  stop_timer: false,
                }; 
  }
  
  //Pump the balloon
  pumpBalloon=() => {
    if(this.state.balloon_number === 15){
        alert('Game Over');
        return false;
    }
    this.setState({btn_collect_disabled: null});  
    let current_point_id = document.getElementById('current_point_id');
    let current_point_val = parseInt(current_point_id.getAttribute('data-current-point')); 
    const balloon_pump_limit = typeof (process.env.REACT_APP_MAX_PUMP_BALLOON_LIMIT) === 'undefined' ? '' : 
                                      Number(process.env.REACT_APP_MAX_PUMP_BALLOON_LIMIT);
    let new_current_point = current_point_val + 1; 
    if(new_current_point === this.state.break_points_array[(this.state.balloon_number - 1)]){
      // If break point is reached and balloon burst then increase balloon number, reset current points etc 
      this.setState({
                    balloon_number: this.state.balloon_number + 1, 
                    total_points: 0,
                    new_current_point: 0,
                    balloon_burst: true,
                    cls_balloon_burst: "disabled"
                  });      
      setTimeout(() => {
        this.setState({
          balloon_burst: false,
          cls_balloon_burst: null
        });
      }, 2000);  
    }else{
      if(current_point_val < balloon_pump_limit){          
        // If currentpo9ints is less than ballon pumping maximum limit 128 
        let ballon_id = document.getElementById('svgBallonImgIcon');
        let balloon_width = parseInt(ballon_id.getAttribute('width')); 
        let inc_ballon_width = balloon_width + 1;
        if(this.state.balloon_burst === false){
          this.setState({balloon_width: inc_ballon_width});
          this.setState({new_current_point: new_current_point});
        }
        if(new_current_point >= 1){
          this.setState({cls_btn_collect_disabled: true});
        }else{
          this.setState({cls_btn_collect_disabled: false});
        }
      }else{
        this.setState({btn_pump_disabled: "disabled"});
        this.setState({btn_collect_disabled: "disabled"});
      }
    }
  }
  
  // Break points Array Formatting
  generateBreakPoints=() => {
    var Reservoir = require('reservoir');
    var array_data = [...Array(128).keys()].map(i => i + 1);
    var my_reservoir = Reservoir(15); 
    array_data.forEach(function(e) {
      my_reservoir.pushSome(e);
    });    
    return my_reservoir;
  }
  
  // Update Ballon Number
  updateBalloonNumber=() => {
    this.setState({balloon_number: this.state.balloon_number + 1});
  }

  // Update Total Points
  updateTotalPoints=() => {
    var new_total_points = this.state.total_points + this.state.new_current_point;
    this.setState({total_points: new_total_points});
  }

  // Update Current points
  updateCurrentPoints=() => {
    this.setState({new_current_point: 0});
  }

  // Enable the Pump Balloon Button from  disabled 
  enablePumpBtn=() => {
    this.setState({btn_pump_disabled: null});
  }

  // Increase the balloon width on Pumping
  resetBalloonSize=() => {
    this.setState({balloon_width: 100});
  }

  // Append collected points
  appendCollectedPoints=() => {    
    this.setState(prevState => ({ 
      collected_points: [...prevState.collected_points, this.state.collected_points]
    }));
  }
  
  // Enable the Collect Points Button from  disabled 
  enableCollectBtn=() => {
    this.setState({btn_collect_disabled: "disabled"});
    this.setState({cls_btn_collect_disabled: "opacity_05"});
  }
  
  // Stop the Timer 
  clickStopTimer = () => {
    this.setState({ stop_timer: true});
  }

  // Game render function
  render() {       
    const { start, stop } = this.state;
    return (
      <div>        
        <BalloonHeader />
        <div className="row">
          <div className="col timer">
            <p>
              <TimerComponent start={start} stop={stop} trigger_stop_timer={this.clickStopTimer}  stop_timer_val={this.state.stop_timer}/>
            </p>
          </div>
        </div>
        <button className="display_none opaty_00" disabled >start</button>
        <button className="display_none opaty_00" disabled >stop</button>
        <div className="points">
            <div className="row">
                <div className="col-8">Current Points</div>
              <div className="col-4 p-value" data-current-point={this.state.new_current_point} id="current_point_id">
                {this.state.new_current_point}
              </div>
            </div>
            <div className="row">
                <div className="col-8">Total Points</div>
                <div className="col-4 p-value">{this.state.total_points}</div>
            </div>  
        </div>  
       <BallonImageSVG balloon_width={this.state.balloon_width} balloon_burst={this.state.balloon_burst} />
       <BallonStandSVG new_current_point={this.state.new_current_point} balloon_number={this.state.balloon_number} 
          trigger_balloon_number={this.updateBalloonNumber} trigger_total_points={this.updateTotalPoints} 
          trigger_current_points={this.updateCurrentPoints} trigger_enable_pump_btn={this.enablePumpBtn} 
          trigger_reset_balloon_size={this.resetBalloonSize} trigger_collected_points={this.appendCollectedPoints} 
          trigger_enable_collect_btn={this.state.btn_collect_disabled} trigger_collect_button_class={this.state.cls_btn_collect_disabled}
          balloon_burst={this.state.balloon_burst} trigger_stop_timer={this.clickStopTimer} />
        <input type="button" name="pump_balloon" id="pump_balloon" value="PUMP UP BALLOON" disabled={this.state.btn_pump_disabled} 
            className={`btn ${this.state.balloon_burst ? "opacity_05" : ""}`} onClick={this.pumpBalloon}/>
      </div>
    );
  }
}

export default Balloons