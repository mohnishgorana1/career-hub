'use client'
import React from 'react'
import CommonCard from './CommonCard'
import JobIcon from './JobIcon'
import { Button } from './ui/button'

function RecruiterJobCard({jobItem}: {jobItem: any}) {
  return (
    <CommonCard 
        icon = {<JobIcon />}
        title={jobItem?.title}
        description={jobItem?.jobDescription}
        footerContent={
            <Button>10 Applicants</Button>
        }

    />
)
}

export default RecruiterJobCard