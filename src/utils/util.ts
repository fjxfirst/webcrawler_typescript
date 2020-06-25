interface Result {
    success: boolean;
    errMsg?: string;
    data: any
}

export const getResPonseData = (data: any, errMsg?: string): Result => {
    if (errMsg) {
        return {
            success: false,
            errMsg,
            data
        };
    }
    return {
        success: true,
        data
    };
};