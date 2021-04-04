import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../assets/Button";
import { CloseIcon, CommentIcon, HeartIcon, OptionsIcon, PostIcon, SavedIcon } from "../assets/Icons";
import { UserContext } from "../../App";
import { useParams, useHistory, Link } from "react-router-dom";
import Loader from "../assets/Loader";
import Modal from "../Modal/Modal";
import verified from '../assets/correct.svg'
import ModalFollowersFollowings from '../ModalFollowersFollowings/ModalFollowersFollowings'

const WrapperPost = styled.div`
 display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  //row-gap: 0;
  margin-top: 5rem;
  img {
    border-radius: 4px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
    width: 300px;
    height: 300px;
    object-fit: cover;
    padding: 0;
    
  }
  .grid-container {
    position: relative;
  }
  .grid-container:hover .overlay {
    display: block;
    cursor: pointer;
  }

  .overlay {
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 300px;
    height: 300px;
    z-index: 4;
    display: none;
  }

  .overlay-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #fff;
    font-weight: 500;
    font-size: 1.1rem;
  }

  svg {
    fill: #fff;
    position: relative;
    top: 4px;
  }

  span {
    display: flex;
    display: block;
    align-items: center;
    padding-right: 0.5rem;
  }

  span:first-child {
    margin-right: 1rem;
  }

  @media screen and (max-width: 1000px) {
    img,
    .overlay {
      width: 98%;
      height: 233px;
    }
  }
  @media screen and (max-width: 800px) {
    grid-gap: 0rem;
    img,
    .overlay {
      width: 98%;
      height: 200px;
    }
  }

  @media screen and (max-width: 700px) {
    grid-gap: 0rem;
    font-size: 0.5rem;
    img,
    .overlay {
      height: 180px;
      width: 98%;
    }
    .overlay-content{
        display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-gap: 0rem;

    img,
    .overlay {
      height: 150px;
      width: 98%;
    }

  }
  @media screen and (max-width: 400px) {
    grid-gap: 0rem;
    row-gap: 5 !important;
    img,
    .overlay {
      height: 120px;
      width: 98%;
    }
  }
`;

const Wrappers = styled.div`
.verified{
  height: 17px;
  width: 17px;
  margin-left:-12px;

}
.following{
      border: 1px solid #dbdbdb !important;
      background: transparent !important;
      color: black;
}
.numberOf{
  font-weight: 900;
  padding-right: 0.5rem !important;
}
.texts{
  font-weight: 400;
  padding-left: 2px;
}

.pointers{
  font-size: 1.5rem;
}
  .profile-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.4rem 0;
  }
  .profile-tab div {
    display: flex;
    cursor: pointer;
    margin-right: 3rem;
  }
  .profile-tab span {
    padding-left: 0.3rem;
  }
  .profile-tab svg {
    height: 24px;
    width: 24px;
  }
  hr {
    border: 0.5px solid #dbdbdb;
  }
`;

const MobileWrapper = styled.div`
  margin: 1rem 0;
  font-size: 1rem;
  padding-left: 1rem;
  .mobile-profile-stats span {
    padding-right: 1rem;
  }
  .mobile-bio,
  .mobile-profile-stats {
    display: none;
  }
  @media screen and (max-width: 645px) {

    
    .mobile-bio {
      display: block;
    }
    .mobile-profile-stats {
      display: block;
      margin-bottom: 0.4rem;
    }
  }
  a {
    color: #0095f6;
  }

`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  margin-bottom: 2rem;

  .avatar {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #d6249f;
    margin-right: 2rem;
  }
  .profile-meta {
    display: flex;
    align-items: baseline;
    margin-bottom: 1rem;
  }
  .profile-meta h2 {
    position: relative;
    top: 3px;
  }
  .profile-stats {
    display: flex;
    margin-bottom: 1rem;
  }

  .options svg {
    position: relative;
    top: 7px;
    margin-left: 1rem;
  }
  span {
    padding-right: 1rem;
  }
  a {
    color: #0095f6;
  }
  @media screen and (max-width: 645px) {
    font-size: 1rem;
    .bio,
    .profile-stats {
      display: none;
    }
    .avatar {
      width: 140px;
      height: 140px;
    }
    .profile-meta {
      flex-direction: column;
    }
    button {
      margin-left: 0;
      margin-top:0;
    }
    .pointers {
      font-size: 1.5rem;
      font-weight: 100 !important;
    }
  }
  @media screen and (max-width: 420px) {
    font-size: 0.9rem;
    .avatar {
      width: 100px;
      height: 100px;
    }
  }
`;


const ProfileOthers = (props) => {
  const [userProfile, setProfile] = useState(null);
  const [showFollowersModal, setFollowersModal] = useState(false);
  const [showFollowingModal, setFollowingModal] = useState(false);
  const [load, setLoad] = useState(false);
  const history = useHistory();
  const closeModal = () => {
    setFollowersModal(false);
    setFollowingModal(false);
  };

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  // const [showFollow,setShowfollow] =useState(state?!state.following.includes(userid):true)
  const [showFollow, setShowfollow] = useState(true);
  const userId = props.match.params.userid;
  useEffect(() => {
    setShowfollow(state && !state.following.some((i) => i._id === userid));
  }, [state,userid]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
        console.log(result)
      });
  }, []);

  const followUser = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data],
            },
          };
        });
        setLoad(false);
        setShowfollow(false);
      });
  };

  const unfollowUser = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item._id !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setLoad(false);
        setShowfollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <Wrappers>
          <Wrapper>
            <img className="avatar" src={userProfile.user.pic} alt="avatar" />
            <div className="profile-info">
              <div className="profile-meta">
                <h4 className="pointers">
   
                  <span>{userProfile.user.username}</span>
                  <span>{userProfile.user.followers.length>=10 ? <img className="verified" src={verified} alt="verified"/> : null }</span>
                </h4>
                {/* <span>{userProfile.user.followers>=10 ? <img src={verified}/> : null }</span> */}
                <div className="options">
                  {showFollow ? (
                    !load ? (
                      <Button
                        onClick={() => {
                          followUser(userId);
                          setLoad(true);
                        }}
                      >
                        Follow
                      </Button>
                    ) : (
                      <Button>
                        <i className="fa fa-spinner fa-spin"></i>
                      </Button>
                    )
                  ) : !load ? (
                    <Button
                    className="following"
                      onClick={() => {
                        unfollowUser(userId);
                        setLoad(true);
                      }}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button>
                      <i className="fa fa-spinner fa-spin"></i>
                    </Button>
                  )}
                </div>
              </div>

              <div className="profile-stats">
                <span><span className="numberOf">{userProfile.posts.length}<span className="texts"> posts</span> </span></span>

                <span
                  className="pointer"
                  onClick={() => setFollowersModal(true)}
                >
                  <span className="numberOf">{userProfile.user.followers.length}<span className="texts"> followers</span> </span>
                </span>

                <span
                  className="pointer"
                  onClick={() => setFollowingModal(true)}
                >
                  <span className="numberOf">{userProfile.user.following.length}<span className="texts"> following</span> </span>
                </span>

                {showFollowersModal && userProfile.user.followers.length > 0 && (
                  <Modal>
                    <ModalFollowersFollowings
                      //  setShFollow={setShowfollow}
                      //   shFollow={showFollow}
                      followUser={followUser}
                      unfollowUser={unfollowUser}
                      load={load}
                      setLoad={setLoad}
                      users={userProfile.user.followers}
                      title="Followers"
                      closeModal={closeModal}
                      loggedInUser={state}
                    />
                  </Modal>
                )}
                {showFollowingModal && userProfile.user.following.length > 0 && (
                  <Modal>
                    <ModalFollowersFollowings
                      //  setShFollow={setShowfollow}
                      //   shFollow={showFollow}
                      followUser={followUser}
                      unfollowUser={unfollowUser}
                      load={load}
                      setLoad={setLoad}
                      users={userProfile.user.following}
                      title="Following"
                      closeModal={closeModal}
                      loggedInUser={state}
                    />
                  </Modal>
                )}
              </div>
              <div className="bio">
                <span className="bold">{userProfile.user.name}</span>
              </div>
            </div>
          </Wrapper>
          <MobileWrapper>
            <div className="mobile-profile-stats">
              <span><span className="numberOf">{userProfile.posts.length}<span className="texts"> posts</span> </span></span>

              <span className="pointer" onClick={() => setFollowersModal(true)}>
              <span className="numberOf"> {userProfile.user.followers.length}<span className="texts"> followers</span> </span>
              </span>

              <span className="pointer" onClick={() => setFollowingModal(true)}>
              <span className="numberOf">{userProfile.user.following.length}<span className="texts"> following</span> </span>
              </span>

              {showFollowersModal && userProfile.user.followers.length > 0 && (
                <Modal>
                  <ModalFollowersFollowings
                    //  setShFollow={setShowfollow}
                    //   shFollow={showFollow}
                    // follow={followUser}
                    // unfollow={unfollowUser}
                    followUser={followUser}
                    unfollowUser={unfollowUser}
                    load={load}
                    setLoad={setLoad}
                    users={userProfile.user.followers}
                    title="Followers"
                    closeModal={closeModal}
                    loggedInUser={state}
                  />
                </Modal>
              )}
              {showFollowingModal && userProfile.user.following.length > 0 && (
                <Modal>
                  <ModalFollowersFollowings
                    //  setShFollow={setShowfollow}
                    //   shFollow={showFollow}
                    // follow={followUser}
                    // unfollow={unfollowUser}
                    followUser={followUser}
                    unfollowUser={unfollowUser}
                    load={load}
                    setLoad={setLoad}
                    users={userProfile.user.following}
                    title="Following"
                    closeModal={closeModal}
                    loggedInUser={state}
                  />
                </Modal>
              )}
            </div>
            <div className="mobile-bio">
              <span className="bold">{userProfile.user.name}</span>
            </div>
          </MobileWrapper>
          <hr />

          <div className="profile-tab">
            <div>
              <PostIcon />
              <span>Posts</span>
            </div>
            <div>
              <SavedIcon />
              <span>Saved</span>
            </div>
          </div>

          <WrapperPost>
            {userProfile.posts.map((item) => (
              <div key={item._id} className="grid-container" onClick={() => history.push(`/post/${item._id}`)}>
                <img src={item.photo} alt="post" />
                <div className="overlay">
                <div className="overlay-content">
                    <span>
                      <HeartIcon /> {item.likes.length}
                    </span>
                    <span>
                      <CommentIcon/>  {item.comments.length}
                    </span>
                    </div>
                  </div>
                </div>

            ))}
          </WrapperPost>
        </Wrappers>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ProfileOthers;
