import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import InputSize from './input-size';
import FilesFilterInput from './input-files-filter';

export default class AdvancedSearchControl extends Component {
  constructor(props)
  {
  	super(props)
  	this.state = {
      type: undefined,
      size: {min: 0, max: 0},
      maxSize: 1024 * 1024 * 1024,
      sizeEnabled: false,
      filesEnabled: false,
      files: {min: 0, max: 0},
      filesMax: 100,
  	}
  	if(this.props.state)
  		this.state = Object.assign(this.state, this.props.state)
  }
  setState(val)
  {
  	super.setState(val, (v) => {
  		if(this.props.onChange)
  			this.props.onChange(this.state)
  	})
  }
  render() {
    return (
      <div className='column w100p' style={{maxWidth: 750, overflow: 'hidden', padding: '0px 18px 15px'}}>
      	<SelectField
          floatingLabelText="Filter content type"
          value={this.state.type}
          onChange={(event, index, value) => this.setState({type: value})}
        >
          <MenuItem value={undefined} primaryText="" />
          <MenuItem value='video' primaryText="Video" />
          <MenuItem value='audio' primaryText="Audio" />
          <MenuItem value='pictures' primaryText="Pictures" />
          <MenuItem value='books' primaryText="Books" />
          <MenuItem value='application' primaryText="Applications" />
          <MenuItem value='archive' primaryText="Archives" />
          <MenuItem value='disc' primaryText="Disk Images" /> 
        </SelectField>
        <div className='w100p'>
          <InputSize value={this.state.size} enabled={this.state.sizeEnabled} maxSize={this.state.maxSize} onChange={({size, maxSize, enabled}) => this.setState({size, maxSize, sizeEnabled: enabled})} />
        </div>
        <div className='w100p'>
          <FilesFilterInput value={this.state.files} filesMax={this.state.filesMax} enabled={this.state.filesEnabled} onChange={({files, filesMax, enabled}) => this.setState({files, filesMax, filesEnabled: enabled})} />
         </div>
      </div>
    );
  }
}