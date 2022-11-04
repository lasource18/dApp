import React from 'react'

export default function Post({ post }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.text}</p>
      </div>
      <div className="card-footer text-muted">
        <p>written by {post.author}</p>
      </div>  
    </div>
  )
}
