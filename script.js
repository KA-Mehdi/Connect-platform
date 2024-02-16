
function loginBtnClick(){
    const user = document.getElementById('user').value
    const password= document.getElementById('password').value

    const params = {
        "username": user,
        "password": password,
    }

    const url = "https://tarmeezacademy.com/api/v1/login"
    axios.post(url, params)
    .then((Response) => {
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("username", JSON.stringify(Response.data.user))       
        ShowAlert("logged in successfully !", 'success')
        setUpUI()
        // const  modal =     document.getElementById("login-modal")
        // const modalInstance = bootstrap.modal.getInstance(modal)
        // modalInstance.hide()
    }).catch((error)=>{
        ShowAlert("wrong information", 'danger')
    })


}

function logoutBtnClick(){
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    ShowAlert("logged out successfully", 'success')
    setUpUI()
}

function registerBtnClick(){
    // 
    const name = document.getElementById('register-name').value
    const username = document.getElementById('register-username').value
    const password= document.getElementById('register-password').value
    const image = document.getElementById('register-image-input').files[0];
    const url = "https://tarmeezacademy.com/api/v1/register"
    // ::::::::::::::::::::::
    // :::::::::::::::::::::::
    // MULTI PART 
    var formData =  new FormData();
    formData.append("username", username)
    formData.append("password",password)
    formData.append("image",image)
    formData.append("name", name)

    const headers = {
        "Content-Type": "multipart/form-data",
    };
    axios.post(url, formData, { headers:headers} )
    .then((Response) => {
        console.log(Response.data)
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("username", JSON.stringify(Response.data.user))       
        
        ShowAlert("new user registered successfully !", 'success')
        setUpUI()
    }).catch((error) =>{
        ShowAlert("the user has already been taken.")

    })
}

function setUpUI()
{
    const token = localStorage.getItem("token")

    const logout = document.getElementById('logout-div')
    const login = document.getElementById('login-div')
    const mybtn = document.getElementById('add-btn')
    if(token == null){
        if(mybtn != null){
            mybtn.style.display = 'none'
        }
        login.style.setProperty("display" , "flex", "important")
        logout.style.setProperty("display" , "none", "important")
    }else {
        if(mybtn != null){
            mybtn.style.display = 'block'
        }
        login.style.setProperty("display" , "none", "important")
        logout.style.setProperty("display" , "flex", "important")

        const user = getUsername()
        document.getElementById("nav-name").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}

function ShowAlert(customMessage , type="danger"){
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `    <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('')

            alertPlaceholder.append(wrapper)
        }

        appendAlert(customMessage, type)
        //  todo: setTimeout(()=>{
        //     const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        //     alert.close()
        // }, 2000)
}

function getUsername(){
    let user = null
    const storageUser = localStorage.getItem("username")
    
    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
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

function createAnewPost(){
    let url ="https://tarmeezacademy.com/api/v1/posts" 
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

function profilclicked(){
    const user = getUsername()
    const userId = user.id
    window.location = `profil.html?userid=${userId}`
}