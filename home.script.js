let  currentPage = 1
let lastPage = 1
window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    if(endOfPage && currentPage < lastPage){
        getposts(false, currentPage += 1)
    }
})

setUpUI()
getposts()


let url ="https://tarmeezacademy.com/api/v1/posts" 
function createAnewPost(){

    let postId = document.getElementById("post-id-input").value
    
    let isCreate = postId == null || postId == ""

    // let url ="https://tarmeezacademy.com/api/v1/posts" 

    const title = document.getElementById('create-post-title').value;
    const body= document.getElementById('create-post-body').value;
    const image = document.getElementById('create-post-image').files[0];
    const token = localStorage.getItem('token');

    // MULTI PART 
    var formData =  new FormData();
    formData.append("body", body)
    formData.append("title",title)
    formData.append("image",image)


    const headers = {
        "authorization": `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
    };

    if(isCreate){
        url ="https://tarmeezacademy.com/api/v1/posts" 
        axios.post(url, formData, { headers:headers} )
        .then((Response) => {
            getposts()
            ShowAlert("Post Created Successfully!", 'success')
        }).catch((error) =>{
            ShowAlert("failed to create post",'danger')
        })
    }else{
        formData.append("_method", "put")
        url =`https://tarmeezacademy.com/api/v1/posts/${postId}` 
        
        axios.post(url, formData, { headers:headers} )
        .then((Response) => {
            getposts()
            ShowAlert("Post Created Successfully!", 'success')
        }).catch((error) =>{
            ShowAlert("failed to create post",'danger')
        })
    }

}



function userclicked(userId){
    window.location = `profil.html?userid=${userId}`
}


function getposts(reload = true , page = 1){

    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
    .then((Response) =>{
        const posts = Response.data.data
        lastPage = Response.data.meta.last_page
        if(reload){
            document.getElementById("posts").innerHTML = ""
        }
        
        for(post of posts){
            const author = post.author
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
                <div class="card shadow" style="background-color:#137c5993;">
                                <div class="card-header">

                                    <div onclick="userclicked(${author.id})" style="display:inline; cursor:pointer;">
                                        <img src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px; " class="rounded-circle border">
                                        <b>${post.author.username}</b>
                                    </div>
                                    ${editBtnCentent}

                                </div>

                                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;background-color:#aceed893;">
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
                document.getElementById("posts").innerHTML += content
        }

    })
}

function postClicked(postid){
    // alert(postid)
    window.location = `postDetails.html?postid=${postid}`
}

function deletetPostBtnClicked(postObject){

    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

function editPostBtnClicked(postObject){

    let post = (JSON.parse(decodeURIComponent(postObject)))
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-submit-edit").innerHTML = "Update"
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("create-post-title").value = post.title
    document.getElementById("create-post-body").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}


function addBtnClicked(){
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-submit-edit").innerHTML = "Create"
    document.getElementById("post-modal-title").innerHTML = "Create post"
    document.getElementById("create-post-title").value = ""
    document.getElementById("create-post-body").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()

}


function ConfirmPostDelete(){
    const postId = document.getElementById("delete-post-id-input").value
    const token = localStorage.getItem("token")
    const url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
    }; 

    
    axios.delete(url, {headers:headers})
    .then((Response) => {
        getposts()
        ShowAlert("Post Deleted Successfully!", 'success')
    }).catch((error) =>{
            ShowAlert("failed to Delete this  post",'danger')
    })
}

