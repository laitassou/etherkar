import 'rc-calendar/assets/index.css';
import React, {Component, PropTypes} from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
//import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-time-picker/assets/index.css';

import 'rc-calendar/assets/index.css';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

let zhCN ='';
//const format = 'DD-MM-YYYY';
const format = 'DD-MM-YYYY HH:mm:ss' ;//'DD-MM-YYYY';
const cn = false ; //location.search.indexOf('cn') !== -1;

const defaultCalendarValue = moment();

//defaultCalendarValue.utcOffset(0);
const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'hh:mm:ss')} />;

function getFormat(time) {
    return time ? format : 'DD-MM-YYYY';
}

function disabledTime(date) {
    if (date && (date.date() === 15)) {
        return {
            disabledHours() {
                return [3, 4];
            },
        };
    }
    return {
        disabledHours() {
            return [1, 2];
        },
    };
}

function disabledDate(current) {
    if (!current) {
        // allow empty select
        return false;
    }
    const date = moment();
    date.hour(0);
    date.minute(0);
    date.second(0);
    return current.valueOf() < date.valueOf();  // can not select days before today
}

class Demo extends React.Component {
    static propTypes = {
        defaultValue: PropTypes.object,
        defaultCalendarValue: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            showTime: true,
            showDateInput: true,
            disabled: false,
            value: props.defaultValue,
        };
    }

    onChange = (value) => {
        this.props.onChange(value);
        console.log('DatePicker change: ', (value && value.format(format)));
        this.setState({
            value,
        });
        this.props.changeState((value ));
    };

    onShowTimeChange = (e) => {
        this.setState({
            showTime: e.target.checked,
        });
    };

    render() {
        console.log('disabled props', this.props.disabled)
        const state = this.state;
        const calendar = this.props.disabled === undefined ? (<Calendar
            locale={cn ? zhCN : enUS}
            style={{zIndex: 1000}}
            dateInputPlaceholder="Date"
            formatter={getFormat(state.showTime)}
            disabledTime={state.showTime ? disabledTime : null}
            defaultValue={this.props.defaultCalendarValue}
            timePicker={timePickerElement}
            showDateInput={state.showDateInput}
            disabledDate={disabledDate}
        />) :
            (
                <Calendar
                    locale={cn ? zhCN : enUS}
                    style={{zIndex: 1000}}
                    dateInputPlaceholder="Date"
                    formatter={getFormat(state.showTime)}
                    disabledTime={state.showTime ? disabledTime : null}
                    timePicker={timePickerElement}
                    defaultValue={this.props.defaultCalendarValue}
                    showDateInput={state.showDateInput}
                />
            );
        return (<DatePicker
                    animation="slide-up"
                    disabled={state.disabled}
                    calendar={calendar}
                    value={state.value}
                    onChange={this.onChange}
                >
                    {
                        ({value}) => {
                            return (
                                <span tabIndex="0">
                                    <input name="select" placeholder="Select date"
                                           className="form-control"
                                           disabled={state.disabled} readOnly value={value && value.format(getFormat(state.showTime)) || ''}/>

                </span>
                            );
                        }
                    }
                </DatePicker>);
    }
}

function onStandaloneSelect(value) {
    console.log('onStandaloneSelect');
    console.log(value && value.format(format));
}

function onStandaloneChange(value) {
    console.log('onStandaloneChange');
    console.log(value && value.format(format));
}


export class Picker extends Component {
    




    render() {
        return (<div>
            <div>
                <Demo disabled={this.props.disabled} changeState={this.props.changeState}  onChange={this.props.onChange} defaultCalendarValue={defaultCalendarValue} ref={ (childComponent) => { this.block2Child = childComponent; } }/>
                </div>
                <div style={{clear: 'both'}}/>
        </div>)
    }
}

export default Picker