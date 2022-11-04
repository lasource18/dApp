import Post from './Post'

export default function Page({ posts }) {
  return (
    posts.map(post => {
        return <Post key={post.id} post={post}/>
    })    
  )
}