/* eslint-disable @typescript-eslint/indent */
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { UserSelector } from './components/UserSelector';
import { getUsers } from './api/api-users';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { Post } from './types/Post';
import { getPosts } from './api/api-posts';
import { Loader } from './components/Loader';
import classNames from 'classnames';
import { PostDetails } from './components/PostDetails';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUsersLoad() {
    setIsError(false);
    try {
      setUsers(await getUsers());
    } catch {
      setIsError(true);
    }
  }

  async function handlePostsLoad() {
    setSelectedPost(null);
    setIsError(false);
    setLoading(true);
    try {
      const postsFromServer = selectedUser
        ? await getPosts(selectedUser.id)
        : posts;

      setPosts(postsFromServer);
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleUsersLoad();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      handlePostsLoad();
    }
  }, [selectedUser]);

  const visibleUsers = users.slice(0, 10);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  users={visibleUsers}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {loading && <Loader />}

                {isError && !loading && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {posts.length !== 0 && !loading && (
                  <PostsList
                    posts={posts}
                    selectedPost={selectedPost}
                    setSelectedPost={setSelectedPost}
                  />
                )}

                {posts.length === 0 && selectedUser && !isError && !loading && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            {selectedPost && selectedPost.userId && (
              <div className="tile is-child box is-success ">
                <PostDetails key={selectedPost.id} post={selectedPost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
