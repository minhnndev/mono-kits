import SwitchLanguage from "../../language/SwitchLanguage";

//0 off, 1 on
const serviceHeader = [{
     id: 'favorite',
     status: 'inactive',
     icon : {
          active: 'https://cdn.mservice.com.vn/app/img/kits/navigation_remove_from_home.png',
          inactive: 'https://cdn.mservice.com.vn/app/img/kits/navigation_add_to_home.png',
     },
     title: {
          active: SwitchLanguage.favoriteOut,
          inactive: SwitchLanguage.favoriteIn
     },
},
{
     id: 'device',
     status: 'inactive',
     icon : {
          active: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_gadgets_iphone.png',
          inactive: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_gadgets_iphone.png',
     },
     title: {
          active: SwitchLanguage.deviceIn,
          inactive: SwitchLanguage.deviceIn
     },
},
{
     id: 'setting',
     status: 'inactive',
     icon : {
          active: 'https://cdn.mservice.com.vn/app/icon/kits/basic_setting.png',
          inactive: 'https://cdn.mservice.com.vn/app/icon/kits/basic_setting.png',
     },
     title: {
          active: SwitchLanguage.setting,
          inactive: SwitchLanguage.setting
     },
},
{
     id: 'transaction',
     status: 'inactive',
     icon : {
          active: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_time_clock_reset.png',
          inactive: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_time_clock_reset.png',
     },
     title: {
          active: SwitchLanguage.transaction,
          inactive: SwitchLanguage.transaction
     }
},
{
     id: 'share',
     status: 'inactive',
     icon : {
          active: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_connection_share.png',
          inactive: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_connection_share.png',
     },
     title: {
          active: SwitchLanguage.share,
          inactive: SwitchLanguage.share
     }
}]

const serviceFooter = [{
     id: 'information',
     status: 'inactive',
     icon : {
          active: 'https://cdn.mservice.com.vn/app/icon/kits/notifications_info.png',
          inactive: 'https://cdn.mservice.com.vn/app/icon/kits/notifications_info.png',
     },
     title: {
          active: SwitchLanguage.information,
          inactive: SwitchLanguage.information
     }
},
{
     id: 'tutorial',
     status: 'inactive',
     icon : {
          active: 'https://cdn.mservice.com.vn/app/img/kits/notifications_guide.png',
          inactive: 'https://cdn.mservice.com.vn/app/img/kits/notifications_guide.png',
     },
     title: {
          active: SwitchLanguage.tutorial,
          inactive: SwitchLanguage.tutorial
     }
},
{
     id: 'question',
     status: 'inactive',
     icon : {
          active: 'https://cdn.mservice.com.vn/app/icon/kits/chat_q_and_a.png',
          inactive: 'https://cdn.mservice.com.vn/app/icon/kits/chat_q_and_a.png',
     },
     title: {
          active: SwitchLanguage.question,
          inactive: SwitchLanguage.question
     }
},
{
     id: 'support',
     status: 'inactive',
     icon : {
          active: 'https://cdn.mservice.com.vn/app/icon/kits/travel_suport_service.png',
          inactive: 'https://cdn.mservice.com.vn/app/icon/kits/travel_suport_service.png',
     },
     title: {
          active: SwitchLanguage.support,
          inactive: SwitchLanguage.support
     }
}]

export {
     serviceFooter,
     serviceHeader
}