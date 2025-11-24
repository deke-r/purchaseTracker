import React from 'react'
import { Link } from 'react-router-dom'

const PurchaseDashboard = () => {
  return (
    <>

<div className="container-fluid mt-5">
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="container  box_sdw11">
                        <div className="row bg-b text-light ">
                            <div className="col-12 py-2 f_13 fw-semibold text-center">
                                Material Requests
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 py-2 f_14 fw-semibold text-start">
                                <div className="container mt-2">
                                    <Link to='/dashboard/purchase/pending-material-requests' className='text-decoration-none'>
                                 <div className="row bg-primary bg-g rounded-2  py-2 my-2  text-light">
                                    <div className="col-md-12">
                                    Pending Material Requests
                                    </div>
                                 </div>
                                    </Link>
                                 <div className="row bg-primary bg-g  rounded-2  py-2 my-2 text-light">
                                    <div className="col-md-12 f_14 fw-semibold">
                                    Account Details
                                    </div>
                                 </div>
                                </div>
                              
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="col-md-6">
                    
                    </div>
            </div>
        </div>

    </div>
    
    </>
  )
}

export default PurchaseDashboard
