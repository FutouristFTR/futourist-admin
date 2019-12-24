import { appRoutes } from "routes";

///// EXAMPLE REGULAR LINK
//
// { route: appRoutes.PLACES,
//   displayName: "Manage Places",
//   iconClass: 'fas fa-map-marker-alt'
// },

///// EXAMPLE DROPDOWN LINKS
//
// { displayName: "Account",
//   iconClass: 'fas fa-map-marker-alt',
//   subitems: [
//     {
//       route: appRoutes.OFFERS,
//       displayName: "My Offers",
//       icon: '',
//     }]},

export default [
  {
    route: appRoutes.REVIEWS,
    displayName: "Reviews",
    iconClass: "fas fa-camera",
  },
  {
    route: appRoutes.PLACES,
    displayName: "Places",
    iconClass: "fas fa-home",
  },
  {
    route: appRoutes.OUTFITS,
    displayName: "Outfits",
    iconClass: "fas fa-images",
  },
  {
    route: appRoutes.BUNDLES,
    displayName: "Collections",
    iconClass: "far fa-images",
  },
  {
    route: appRoutes.USERS,
    displayName: "Users",
    iconClass: "fas fa-users",
  },
];
