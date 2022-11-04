import React from 'react'

export default function Post({ entry }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
          <h5 className="card-title">{entry.title}</h5>
          <p className="card-text">{entry.text}</p>
      </div>
      <div className="card-footer text-muted">
        <p>written by {entry.author}</p>
      </div>  
    </div>
  )
}
