import React from 'react'

function Main() {
  return (
    <div>
      <div
  className="min-h-screen mb-3 hero" 
  style={{
    backgroundImage: "url(imgs/4927041.jpg)",
  }} >
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="text-center hero-content text-neutral-content">
    <div className="max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Speak Up, We’ll Take It Forward</h1>
      <p className="mb-5">
        A secure digital system designed for students to file complaints, monitor progress, and hold departments accountable.
      </p>
      <button className="btn btn-primary">Lodge a Complaint</button>
    </div>
  </div>
</div>
    </div>
  )
}

export default Main
