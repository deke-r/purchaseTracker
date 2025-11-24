import React from 'react'
import { Link } from 'react-router-dom'

export const EmployeeDashboard = () => {
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
                                    <Link to='/dashboard/employee/request-for-material' className='text-decoration-none'>
                                 <div className="row bg-primary bg-g rounded-2 py-2 my-2  text-light">
                                    <div className="col-md-12">
                                    Request for material
                                    </div>
                                 </div>
                                    </Link>
                                 <div className="row bg-primary bg-g rounded-2  py-2 my-2 text-light">
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

        {/* <div className="container">
            <div className="row">
                <div className="col-md-6">
                <div className="container mt-2">
                                 <div className="row bg-primary bg-g rounded-2 py-1  text-light">
                                    <div className="col-md-12 f_14 fw-semibold text-center">
                                    Request for material
                                    </div>
                                 </div>
                                </div>
                </div>
                <div className="col-md-6"></div>
                </div>
        </div> */}
    </div>
    </>
  )
}
