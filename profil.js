setUpUI()
getUser()
getposts()

function getUser(){
    const id = getCurrentUserId()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((Response) => {
        const user = Response.data.data
        
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username
        document.getElementById("main-info-img").src = user.profile_image
        
        // posts and comments counts
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count
        document.getElementById("name-post").innerHTML = `${user.username}'s posts`
        

    })
}

function getCurrentUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id 
}

function getposts(){
    const id = getCurrentUserId()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    
    .then((Response) =>{
        const posts = Response.data.data
        document.getElementById("user-posts").innerHTML = ""
        for(post of posts){           
            let postTitle = ""
            
            // show or hide (edit) button
            let user = getUsername()
            let isMyPost = user != null && post.author.id == user.id
            let editBtnCentent = ``

            if(isMyPost){
                editBtnCentent = 
                    `
                        <button class="btn btn-danger" style="margin-left:5px;float:right" onclick="deletetPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                        <button class="btn btn-secondary" style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    `                
            }
            
            if(post.title != null){
                postTitle =  post.title
            }
            const content = 
                `
                <div class="card shadow" style="background-color:#137c5993;cursor:pointer;">
                                <div class="card-header" >
                                    <img src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px; " class="rounded-circle border">
                                    <b>${post.author.username}</b>
                                    ${editBtnCentent}
                                </div>

                                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                                    <img src="${post.image}" class="w-100">

                                    <h6 style="color: rgb(122, 119, 119);margin-top: 5px;">
                                        ${post.created_at}
                                    </h6>

                                    <h5>
                                        
                                        ${post.title}
                                    </h5>

                                    <p>
                                        ${post.body}
                                    </p>

                                    <hr>

                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                        </svg>
                                        <span>
                                            ${post.comments_count}
                                        </span>
                                    </div>
                                </div>
                            </div>            
                `
                document.getElementById("user-posts").innerHTML += content
        }

    })
}
