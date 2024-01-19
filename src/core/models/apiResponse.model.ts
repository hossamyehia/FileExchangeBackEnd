class ApiResponse {

    private Success: boolean;
    private Data: Array<object>;
    private Message: string;
  
    constructor({ success = true,  message = 'Ok', data = [] }) {
      this.Data = data;
      this.Success = success;
      this.Message = message;
    }
  
    get data() {
      return this.Data;
    }
  
    set data(data: Array<object>) {
      this.Data = data;
    }
  
    get success() {
      return this.Success;
    }
  
    set success(success: boolean) {
      this.Success = success;
    }
  
    get message() {
      return this.Message;
    }
  
    set message(message: string) {
      this.Message = message;
    }
  
    toJSON() {
      return {
        Success: this.Success,
        Message: this.message,
        Data: this.data,
      }
    }
  }
  
  export default ApiResponse;