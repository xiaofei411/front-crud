import React from 'react';
import Typography from '@material-ui/core/Typography';
import Posts from './Posts';
import Create from './Create';
import axios from 'axios';
//import { ROWS } from '../../store';


export default class Post extends React.Component {

    constructor(props) {
        super(props); 
        this.state = { rows: [] };
    }

    componentDidMount() {
        var classObj = this;
        axios.get('http://localhost:9000/api/v1/class')
        .then(function (response) {

            classObj.setState({ rows: response.data.data});
        })
        .catch(error => {
            console.log(error);
        })
    }
    
    handleCreate = (newItem) => {
        let classObj = this;

        let config = {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'authtoken': this.props.token
            }
        }
          
        let data = {
            vendor_id : '5be32eed-06fa-481e-bccb-250956a92b1b',
            name: newItem.name,
            description: newItem.description,
            location: 'location',
            price: 100,
            seats: '6',
            image_url: 'https://uploads-ssl.webflow.com/5bebfd31fb29cc51aeb8688a/5bebfd31fb29cc4e27b86895_transparent_16_9-p-1080.png',
            start_timestamp: '2019-03-08 20:00:00+07',
            end_timestamp: '2019-03-08 20:00:00+07',
        };

        axios.post('http://localhost:9000/api/v1/class', data, config)
            .then(function (response) {
               //console.log(response);
               
               const list = [...classObj.state.rows];

                newItem.id = response.data.data[0];
                list.push(newItem);
                //console.log(newItem);
                classObj.setState({ rows: list });
            })
            .catch(error => {
                console.log(error);
            })

    };

    handleDelete = id => {

        let config = {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'authtoken': this.props.token
            }
        }
        axios.delete('http://localhost:9000/api/v1/class/' + id, config)
        .then(function (response) {
            //console.log(response)
        })
        .catch(error => {
            //console.log(error);
        })
        this.setState(({ rows }) => ({
            rows: rows.filter(ex => ex.id !== id)
        }))
    }

    handleEdit = row => {
        
        let data = {
            vendor_id: '5be32eed-06fa-481e-bccb-250956a92b1b',
            name: row.name,
            description: row.description,
            location: 'location',
            price: 100,
            seats: '6',
            image_url: 'https://uploads-ssl.webflow.com/5bebfd31fb29cc51aeb8688a/5bebfd31fb29cc4e27b86895_transparent_16_9-p-1080.png',
            start_timestamp:'2019-03-08 20:00:00+07',
            end_timestamp: '2019-03-08 20:00:00+07',
        };


        let config = {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'authtoken': this.props.token
            }
        }

        //console.log('edit')
        //console.log(row);
        axios.post('http://localhost:9000/api/v1/class/'+ row.id, data, config)
        .then(function (response) {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })

        let local_rows = this.state.rows;
        let idx = local_rows.findIndex(ex => ex.id === row.id);
        local_rows[idx] = row;
        this.setState({rows : local_rows});
        //console.log(this.state)
    }

    
    render() {
      const { rows } = this.state;
      //const { token } = this.props
  
      return (
        <div>
            <Typography variant="h3" style={{textAlign:"left", marginTop:100, marginLeft:100}}>
                Posts
            </Typography>
            <Posts rows={rows} _onDelete={this.handleDelete}  _onEdit={this.handleEdit}/>
            <Create _onCreate={this.handleCreate}/>
        </div>
      );
    }
  }