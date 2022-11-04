// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Web3Forum {
    struct Post {
        string id;
        address author;
        string title;
        string text;
    }

    Post[] posts;
    uint256 size;

    function addPost(string memory id, address _author, string memory title, string memory text) public {
        posts.push(Post(id, _author, title, text));
        size++;
    }

    function getPost(uint256 id) public view returns (string memory, address, string memory, string memory){
        Post memory post = posts[id];
        return (post.id, post.author, post.title, post.text);
    }

    function getSize() public view returns (uint256) {
        return size;
    }
}
