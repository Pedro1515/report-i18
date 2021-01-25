import React, { Component } from "react";
import { getMedias } from "api";
import { Modal, Button} from "react-bootstrap";
import { Spinner } from "components";

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
          })
    };
  
    render() {

        return (
          <>
            <div className="d-flex align-items-center justify-content-center" >
            {
              <Button 
              className="block w-full lg:inline-block lg:w-auto px-4 py-3 lg:py-2 bg-indigo-300 rounded-lg font-semibold text-sm text-gray-800 mt-4 lg:mt-0 lg:order-1"
              variant="primary" 
              onClick={() => {
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

            
              <div className="relative px-4 min-h-screen lg:flex lg:items-center lg:justify-center">
                <div className="bg-black opacity-25 w-full h-full absolute z-10 inset-0"></div>
                <div className="bg-white rounded-lg lg:max-w-v lg:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 lg:relative">

                    <div className="flex flex-1">
                      
                      {this.state.base64String==''? 
                        <div className="flex-center flex-1">
                          <Spinner className="h-10 w-10 text-gray-500" />
                        </div>
                      :
                        <img src={this.state.base64String} /> 
                      }

                  </div>
                  <div className="text-center lg:text-right mt-4 lg:flex lg:justify-end">
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
