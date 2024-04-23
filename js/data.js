const token = localStorage.getItem("jwtToken");
import {userInfo, userCompletedProjects, auditRatio, projectsLowtoHighXp, XpProgress} from "./queries.js"
import { username, audit, completedProjects, xpEarned, XpProgressGraph } from "./stats.js";

export const getUserData = async () => {
 try {
    // await beacuse otherwise userdata doesnt get info
    const userInfoResponse = await fetchGraphQL(userInfo);
    const auditRatioResponse = await fetchGraphQL(auditRatio)
    const userCompletedProjectsResponse = await fetchGraphQL(userCompletedProjects)
    const lowToHighXp = await fetchGraphQL(projectsLowtoHighXp)
    const XpProgressResponse = await fetchGraphQL(XpProgress)

    if (!userInfoResponse.ok){
        throw new Error("failed to get data")
    }
    // username
    let userData = await userInfoResponse.json();
    username(userData)
    //auditRatio
    userData = await auditRatioResponse.json();
    audit(userData)
    //projects
    userData = await userCompletedProjectsResponse.json()
    completedProjects(userData)

    userData = await lowToHighXp.json()
    xpEarned(userData)

    userData = await XpProgressResponse.json()
    XpProgressGraph(userData)
  
    }catch (error) {
        console.error("Error:", error);
      }
};

// fetch data
const fetchGraphQL = async (query) =>{
   return fetch("https://01.kood.tech/api/graphql-engine/v1/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    }
  );
}

let logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', logout)

function logout(){
    localStorage.clear();
    location.reload();
    window.location.href = 'index.html';
  }
