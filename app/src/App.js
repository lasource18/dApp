import { Contract, providers } from "ethers"
import React, { useState, useRef, useEffect } from 'react'
import Page from './Page'
import { v4 as uuidv4 } from 'uuid'
import { abi, NFT_CONTRACT_ADDRESS } from './constants'
import Web3Modal from 'web3modal'
import ReactPaginate from 'react-paginate'

function App() {
  const [posts, setPosts ] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)

  const indexOfLastPost = currentPage * postsPerPage
  const indexofFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexofFirstPost, indexOfLastPost)

  const [walletConnected, setWalletConnected] = useState(false)
  const titleRef = useRef("")
  const postRef = useRef("")
  const buttonRef = useRef("")
  const web3ModalRef = useRef()

  const handleAddEntry = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer)
      
      const author = signer.getAddress()
      const title = titleRef.current.value
      const text = postRef.current.value
      
      if(title === '' || text === '')
        return

      console.log(title)
      console.log(text)

      await nftContract.addPost(uuidv4(), author, title, text)

      setPosts([...posts, { id: uuidv4(), author: author, title: title, text: text }])
      titleRef.current.value = null
      postRef.current.value = null
    } catch (e) {
      console.error(e)
    }
  }

   const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect()
      const web3Provider = new providers.Web3Provider(provider)

      const { chainId } = await web3Provider.getNetwork()
      if(chainId !== 5) {
        window.alert('Change to the Goerli network')
        throw new Error('Change to the Goerli network')
      }

      if(needSigner) {
        const signer = web3Provider.getSigner()
        return signer
      }

      return web3Provider
    } catch (e) {
      console.error(e)
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch(e) {
      console.error(e)
    }
  }

  const displayButton = () => {
    if(!walletConnected) {
      return (
        <button onClick={connectWallet} className="btn btn-primary">
          Connect your wallet
        </button>
      )
    } else {
      return(
        <div class="d-grid gap-2 col-6 mx-auto">
          <button ref={buttonRef} className="btn btn-primary mb-2" onClick={fetchPosts}>Get Posts</button>
          <button className="btn btn-success" onClick={handleAddEntry}>Add New Entry</button>
        </div>
      )
    }
  }

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  }

  const  fetchPosts = async () => {
    try {
      const provider = await getProviderOrSigner()
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider)

      const storedPosts = []
      const size = await nftContract.getSize()

      for (let index = 0; index < size; index++) {
        const [id, author, title, text] = await nftContract.getPost(index)
        const post = { id, author, title, text }
        console.log(post)
        storedPosts.push(post)
      }
      if(storedPosts)
        setPosts(storedPosts)

        buttonRef.current.style.display = 'none'
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false
      })
    }
    connectWallet()
  }, [walletConnected])

  return (
    <div className="container text-center border">
      <h1>Web3Forum</h1>
      <div className="row">
        <div className="mb-3">
        <label htmlFor="text">Title</label>
        <br></br>
          <input ref={titleRef} type="text"></input>
        </div>
        <div className="form-floating mb-3">
          <textarea ref={postRef} id="text" placeholder="What's on your mind?"></textarea>
        </div>
        <div>
           {displayButton()}
        </div>
      </div>
      <div className="row mt-3">
        {posts ? (
            <div className="mb-3">
               <Page posts={currentPosts} />
               <ReactPaginate
                  onPageChange={paginate}
                  pageCount={Math.ceil(posts.length / postsPerPage)}
                  previousLabel={'Prev'}
                  nextLabel={'Next'}
                  containerClassName={'pagination justify-content-center'}
                  pageLinkClassName={'page-link'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
                  activeLinkClassName={'active'}
               />
            </div>
         ) : (
            <div className="loading">Loading...</div>
         )}
      </div>
    </div>
  )
}

export default App;
