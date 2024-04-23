export const userInfo  = `
    {
    user {
        id
        login
      }
    }
`;


export const userCompletedProjects = `
{
  transaction (
    order_by: {createdAt: desc}
    where:{ type: {_eq: xp}
    path: { _regex: "^\\/johvi\\/div-01\\/(?!piscine-js\\/).*$" }
  }
  )
  {
  amount
  objectId
  userId
  path
  type
    object{
      name
    }
 }
}
`;

export const auditRatio = 
`
 {
    user {
      auditRatio
      totalUp
      totalDown
  }
}
`;

// nested using transaction and object table
export const projectsLowtoHighXp =
`
{
  transaction (
    order_by: {amount:desc}
    where:{ 
      type: {_eq: xp}
    	path: { _regex: "^\\/johvi\\/div-01\\/(?!piscine-js\\/).*$" }
    }
    limit: 10
  )
  {
  amount
  objectId
  path
  type
    object{
      name
    }
 }
}
`

export const XpProgress = 
`
{
  transaction (
    order_by: {createdAt:asc}
    where:{ 
      type: {_eq: xp}
    	path: { _regex: "^\\/johvi\\/div-01\\/(?!piscine-js\\/).*$" }
    }
  )
  {
  amount
	createdAt
 }
}
`
