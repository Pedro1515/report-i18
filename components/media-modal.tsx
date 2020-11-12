import React, { Component } from "react";
import { getMedias } from "api";
import { Modal, Button} from "react-bootstrap";

interface IMedia {
  testId?: string;
}

 export class MediaModal extends Component<IMedia> {
  state={
    base64String:'',
    isOpen: false,
  }

    constructor(props) {
      super(props);
    }

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false });

    fetchMedia = async () => {
      getMedias(this.props.testId)
        .then(res => {

            this.setState({base64String: `${res}`})
            // console.log(this.state.base64String);
          })
    };
  
    render() {

        return (
          <>
            <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }} >
            {
              <Button 
              className="block w-full lg:inline-block lg:w-auto px-4 py-3 lg:py-2 bg-indigo-300 rounded-lg font-semibold text-sm text-gray-800 mt-4 lg:mt-0 lg:order-1"
              variant="primary" 
              onClick={() => {
                              // console.log(this.state.base64String);
                              // console.log(this.state.isOpen);
                              this.openModal();

                              if(this.state.base64String == ""){
                                this.fetchMedia();
                              };
                            }}> 
                View Image 
              </Button>              
            }
            </div>
            
            <Modal show={this.state.isOpen} >

            
              <div class="relative px-4 min-h-screen lg:flex lg:items-center lg:justify-center">
                <div class="bg-black opacity-25 w-full h-full absolute z-10 inset-0"></div>
                <div class="bg-white rounded-lg lg:max-w-v lg:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 lg:relative">
                  <div class="lg:flex items-center">

                    {this.state.base64String==''? <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64" ></div> : null }
                    
                    { <img src={this.state.base64String} /> }
                  </div>
                  <div class="text-center lg:text-right mt-4 lg:flex lg:justify-end">
                    <Button 
                      className="block w-full lg:inline-block lg:w-auto px-4 py-3 lg:py-2 bg-indigo-300 rounded-lg font-semibold text-sm text-gray-800 mt-4 lg:mt-0 lg:order-1"
                      onClick={this.closeModal}
                    >Close</Button>
                  </div>
                </div>
              </div>

            </Modal> 
          </>

        )
      }
  }
