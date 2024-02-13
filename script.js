
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


