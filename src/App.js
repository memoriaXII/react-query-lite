import { useState } from 'react';
import { QueryClientProvider, useQuery } from './utils/react-query-lite';
import { QueryClient } from './utils/react-query-lite';
import axios from 'axios';

const queryClient = new QueryClient();

export default function App() {
  const [postId, setPostId] = useState(-1);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-col justify-between">
        {postId > -1 ? (
          <Post postId={postId} setPostId={setPostId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}
      </div>
    </QueryClientProvider>
  );
}

const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      await sleep(1000);
      const { data } = await axios.get('http://jsonplaceholder.typicode.com/posts');
      return data.slice(0, 5);
    }
  });
};

const usePost = (postId) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      await sleep(1000);
      const { data } = await axios.get(`http://jsonplaceholder.typicode.com/posts/${postId}`);
      return data;
    }
  });
};

const Posts = ({ setPostId }) => {
  const postQuery = usePosts();
  return (
    <div>
      <h1>Posts</h1>
      <div>
        {postQuery.status === 'loading' ? (
          <div className="text-red-500">Loading</div>
        ) : (
          <div>
            {postQuery.data.map((post) => {
              return <div key={post.id}>{post.title}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Post = ({ postId, setPostId }) => {
  const postQuery = usePost(postId);
  return <div>{postQuery.data.body}</div>;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
