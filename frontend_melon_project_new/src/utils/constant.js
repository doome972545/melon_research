export const HOST = import.meta.env.VITE_API_URL

export const HOUSE = "/api/house"
export const AUTH = "/api/auth"
export const ADMIN = "/api/admin"

// process
export const ADD_HOUSE = `${HOUSE}/addHouse`
export const GET_HOUSE = `${HOUSE}/getHouse`
export const GET_PLANTING_TYPE = `${HOUSE}/getPlantingType`
export const GET_ACTIVITIES = `${HOUSE}/getActivities`
export const GET_ACTIVITIES_COSTS = `${HOUSE}/getActivitiesCosts`
export const SAVEACTIVITIES = `${HOUSE}/saveActivities`
export const GET_LIST = `${HOUSE}/getList`
export const ADD_MELON_COSTS = `${HOUSE}/add_melon_costs`
export const GET_MELON_COSTS = `${HOUSE}/get_melon_costs`
export const EDIT_MELON_COSTS = `${HOUSE}/edit_melon_costs`
export const DELETE_MELON_COSTS = `${HOUSE}/delete_melon_costs`
export const END_PROCRESS = `${HOUSE}/end_process_for_greenhouse`
export const DELETE_GREENHOUSE = `${HOUSE}/delete_greenhouse`

// login
export const LOGIN = `${AUTH}/login`
export const REGISTER = `${AUTH}/register`

// admin
export const GET_USERS = `${ADMIN}/getUsers`
export const GET_USER_ALL_HOUSE = `${ADMIN}/getUserAllhouse`
export const GET_USER_ACTIVITIES = `${ADMIN}/getUserActivities`
export const GET_LIST_COST_ADMIN = `${ADMIN}/getListCostsAdmin`
export const APPROVE_USER = `${ADMIN}/approveUser`
export const DATA_CHART = `${ADMIN}/get_data_chart`
export const GET_COSTS = `${ADMIN}/get_costs`
export const EDIT_COSTS = `${ADMIN}/edit_costs`
export const CREATE_COSTS = `${ADMIN}/create_costs`