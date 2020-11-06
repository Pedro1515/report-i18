import React, { Component } from "react";
import { getMedias } from "api";

 export class MediaModal extends Component {
    
    state = {
      base64String: '',
      id: '',
    };  

   constructor(props) {
     super(props);
     console.log(props);
     this.state = {
        base64String: '',
        id: props.id,
      };  
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
      console.log(prevState)
    };
  
    fetchMedia = async () => {
      getMedias(this.state.id)
        .then(res => {
            this.setState({base64String: `${res}`})
            console.log(this.state.base64String);
          })

    };
  
    render() {

        return (
          <div>
            <button 
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button" 
              onClick={() => {
                if(this.state.base64String == ""){
                        this.fetchMedia();
                };
              }}  
            >View Image </button>

          </div>
        )
      }
  }
