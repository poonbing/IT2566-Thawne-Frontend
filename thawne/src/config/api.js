const API_CONFIG = {
        baseApiUrl: 'http://localhost:5000',
        endpoints: {
        login: 'http://localhost:5000/login',
        verifyChatUser: 'http://localhost:5000/verifychatuser',
        checkUserAccess: 'http://localhost:5000/check_user_access',
        getTopMessages: 'http://localhost:5000/gettopmessages',
        submitMessage: 'http://localhost:5000/submitmessage',
        getAllChat: 'http://localhost:5000/getallchat',
        augmentUser: 'http://localhost:5000/augmentuser',
        augmentUserChatPermission: 'http://localhost:5000/augmentuserchatpermission',
        createChat: 'http://localhost:5000/createchat',
        },
    };
    
export default API_CONFIG;
