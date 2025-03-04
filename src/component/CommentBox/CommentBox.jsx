import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentBox = ({
  children,
  content,
  articleId,
  comment_id,
  replie_count,
  getComment,
  user_id,
  isAuther,
  hasReplie,
}) => {
  const [commentUserData, setCommentUserData] = useState({
    username: "piggy",
    profile_picture:
      "https://megapx-assets.dcard.tw/images/c3bb80c5-2fd9-42e4-9310-d61ef38473e2/640.jpeg",
  });
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [review, setReview] = useState("");
  const [showAllReview, setShowAllReview] = useState(false);
  const getCommentUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${user_id}`);
      setCommentUserData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const postReviewComment = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/comments`, {
        post_id: articleId,
        parent_comment_id: comment_id,
        content: review,
      });
      await getComment();
      setIsReviewOpen(false);
      setReview("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="d-flex flex-column gap-3 mb-5">
        <div className="d-flex align-items-center gap-2">
          <img
            className="avatar object-fit-cover rounded-pill"
            src={commentUserData.profile_picture}
            alt="avatar"
          />
          <a href="#">{commentUserData.username}</a>
          {isAuther && <span className="text-gray">作者</span>}
        </div>
        <p>{content}</p>
        <div className="d-flex gap-5">
          <a href="#" className="d-flex align-items-center text-primary gap-1">
            <span className="material-symbols-outlined icon-fill fs-6">
              favorite
            </span>
            2
          </a>
          <a
            href="#"
            className={`d-flex align-items-center ${
              hasReplie ? "text-primary" : "text-gray"
            } gap-1`}
            onClick={(e) => {
              e.preventDefault();
              setIsReviewOpen(!isReviewOpen);
            }}
          >
            <span className="material-symbols-outlined icon-fill fs-6">
              chat_bubble
            </span>
            {replie_count}
          </a>
          <a
            href="#"
            className="text-gray"
            onClick={(e) => {
              e.preventDefault();
              setIsReviewOpen(!isReviewOpen);
            }}
          >
            回覆
          </a>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 ms-5 mb-5">
        {children.map((childrenItem, index) => {
          return (showAllReview || index < 2) && childrenItem;
        })}
        {isReviewOpen && (
          <div className="input-group">
            <input
              type="text"
              className="form-control border-end-0 rounded-1"
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
              }}
            />
            <span
              className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1"
              onClick={() => {
                postReviewComment();
              }}
            >
              send
            </span>
          </div>
        )}
        {!showAllReview && replie_count > 2 && (
          <a
            href="#"
            className="text-primary"
            onClick={(e) => {
              e.preventDefault();
              setShowAllReview(true);
            }}
          >
            全部留言
          </a>
        )}
      </div>
    </>
  );
};

export default CommentBox;
