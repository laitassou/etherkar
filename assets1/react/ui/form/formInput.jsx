import React from 'react';

const FormInput = (props) => (
    <div>
        <span>
            <label className="control-label">{props.labelText}</label>
            <input onChange={props.onChange} className='form-control' type={props.type}
                   placeholder={props.placeholder}/>
        </span>
    </div>
);

export default FormInput