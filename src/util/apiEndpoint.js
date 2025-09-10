const BASE_URL ="https://cloud-share-api.onrender.com/api/v1.0";

 export const apiEndoints = {

    FETCH_FILES :`${BASE_URL}/files/my`,
    GET_CREDITS:`${BASE_URL}/users/credits`,
    TOGGLE_FILE: (id) =>`${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE :(id)  => `${BASE_URL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
    UPLOAD_FILE : `${BASE_URL}/files/upload`,
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT:`${BASE_URL}/payments/verify-payment`,
    TRANSACTION:`${BASE_URL}/transactions`,
    PUBLIC_FILE_VIEW: (fileId) => `${BASE_URL}/files/public/${fileId}`


}
