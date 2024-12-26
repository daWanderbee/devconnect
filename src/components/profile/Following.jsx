import React, { use } from 'react'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Following = ({following}) => {
  return (
    <div className=" h-full w-full">    
      <div className='flex flex-col items-center justify-center'>
        <h1 className="text-2xl font-bold">{following?.length}</h1>
        <p className="text-sm">Following</p>
        </div>
    </div>
  )
}
Following.propTypes = {
  following: PropTypes.array.isRequired,
}

export default Following
