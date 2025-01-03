import React, { use } from 'react'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Followers = ({followers}) => {
  return (
    <div className=" h-full w-full">    
      <div className='flex flex-col items-center justify-center'>
        <h1 className="text-2xl font-bold">{followers?.length}</h1>
        <p className="text-sm">Followers</p>
        </div>
    </div>
  )
}
Followers.propTypes = {
  followers: PropTypes.array.isRequired,
}

export default Followers
