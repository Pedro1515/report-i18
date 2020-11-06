import React, { Component } from "react";
import { getMedias } from "api";

 export class MediaModal extends Component {
   
  
   constructor(props) {
     super(props);
     this.handleChange = this.handleChange.bind(this);
     this.state = {
        base64String: '',
        id: props.id,
      };  
    }

    handleChange(e) {
      console.log("sada" +e)
      // this.setState({id: e.target.value});
    }
  

    


  
    componentDidUpdate = (prevProps, prevState, snapshot) => {
      console.log(snapshot)
      console.log(prevState)
      if (prevProps.id !== this.state.id) {
        console.log(prevProps);
        this.fetchMedia();
      }else{
        console.log("iguales!!! ---->    " + prevProps.id  +" <--> " + this.state.id );
        
      }
    };
  
    fetchMedia = async () => {
      getMedias(this.state.id)
        .then(res => {
            this.setState({base64String: `${res}`})
          })

    };
  
    render() {

        return (
            <div>
              <img src={this.state.base64String} />

            </div>
      )
    }
  }
