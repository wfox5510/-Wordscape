import avatar from "../../assets/images/avatar-1.png";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {  alertDelete, alertReply } from "../../utils/alertMsg" 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useNavigate } from "react-router-dom";

const Blog_CommentReply = ({comment, likeComment, getBlogArticle, token, postId, formatTimeAgo, isAuthor, userId, setIsLoading}) => {

  const [addReply, setAddReply] = useState("");
  const [commentId, setCommentId] =useState("");
  const [showCommentReply, setShowCommentReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // 控制回覆展開
  const [isEditing, setIsEditing] = useState(false); // 控制是否進入編輯模式
  const [editedReply, setEditedReply] = useState(comment.content); // 編輯中的留言內容
  const [isGood, setIsGood ] =useState(false);

  useEffect(() => {
    if (!likeComment) {
      console.warn("⚠️ likeComment 函式未傳遞，請檢查 Blog_ArticleCard.jsx");
    }
  }, [likeComment]);

  //發送留言回覆請求
  const addCommentRep = async()=>{
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/comments`,{
        post_id: postId,
        parent_comment_id:commentId,
        content: addReply,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setIsLoading(false);
      getBlogArticle();
      Swal.fire(alertReply);

    } catch (error) {
      console.log("發送文章留言失敗",error)
    }

  }



  // ✅ 編輯留言請求
  const editComment = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `${API_BASE_URL}/comments/${comment.id}`,
        { content: editedReply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLoading(false);
      getBlogArticle();
      setIsEditing(false);
    } catch (error) {
      console.error("更新留言失敗", error);
    }
  };



// ✅ 主要刪除函式，直接調用後端 API（後端會處理巢狀留言刪除）
const deleteComment = async (commentId) => {
 
  try {
    
    
    await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    Swal.fire(alertDelete);
    // 🔥 確保前端獲取最新留言
    await getBlogArticle();  // 👉 等待最新留言載入完成，確保畫面即時更新
  } catch (error) {
    console.error(`❌ 刪除留言 ${commentId} 失敗`, error);
  }
};

  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column gap-1 py-5 mt-5 mt-md-0 border-top border-gray_light">
      {/* 顯示留言者資訊 */}
      <div className="d-flex">
        <div className="d-flex align-items-center gap-2" 
          onClick={() => navigate(`/blog/${comment.user_id}`)} // 🚀 這裡改用 navigate
          style={{ cursor: "pointer" }}
        >
          <img className="avatar rounded-circle border" src={comment.profile_picture ||"https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"} alt="avatar" />
            {comment.user_name}
        </div>
      </div>



      {/* ✅ 一般模式 / 編輯模式 */}

      {isEditing ? (
        <div className="input-group">
          <input
            type="text"
            className="form-control border-end-0 rounded-1"
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
          />
          {/* ✅ 送出編輯按鈕 */}
          <span
            className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1 "
            onClick={editComment}
          >
            check_circle
          </span>
          {/* ❌ 取消編輯按鈕 */}
          <span
            className="material-symbols-outlined input-group-text border-start-0 bg-light text-danger icon-fill fs-6 rounded-1 "
            onClick={() => {
              setIsEditing(false);
              setEditedReply(comment.content); // 取消時恢復原始內容
            }}
          >
            cancel
          </span>
        </div>
      ) : (
        <p>{comment.content}</p>
      )}

     
      
      {/*按讚、留言等互動按鈕 */}
      <div className="d-flex align-items-center gap-5">
        <p className="text-gray">{formatTimeAgo(comment.created_at)}</p> {/* ✅ 顯示發言時間 */}
        <div className={`d-flex gap-1 ${isGood ? "text-primary" : "text-gray"}`} onClick={() => {
          likeComment(comment.id)
          setIsGood(!isGood)
          }} style={{ cursor: "pointer" }}>
          <span className="material-symbols-outlined">
            favorite
          </span>
          <p>{comment.likes_count}</p>
        </div>
        <div className="d-flex text-gray gap-1">
          <span className="material-symbols-outlined">
            chat_bubble
          </span>
          <p>{comment.replies.length}</p>
        </div>
        <p className="text-gray hover-effect"  style={{ cursor: "pointer" }}
            onClick={() => {
                  setShowCommentReply(!showCommentReply)
                  setCommentId(comment.id)
                  }}>回覆</p>

        {/* 🔥 三點選單（Dropdown Menu）🔽 */}
        {(isAuthor || comment.user_id === userId) && (
          <div className="dropdown">
            <i
              className="bi bi-three-dots text-gray fs-6"
              id={`dropdownMenuButton-${comment.id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ cursor: "pointer" }}
            ></i>
            <ul
              className="dropdown-menu dropdown-menu-end py-3 px-5 shadow-sm"
              aria-labelledby={`dropdownMenuButton-${comment.id}`}
            >
              {/* 🔥「編輯」：只有留言本人可見 */}
              {comment.user_id === userId && (
                <li className="dropdown-item" onClick={() => setIsEditing(!isEditing)} style={{ cursor: "pointer" }}>
                  編輯
                </li>
              )}

              {/* 🔥「刪除」：文章作者 or 留言本人可見 */}
              {(isAuthor || comment.user_id === userId) && (
                <li className="dropdown-item text-danger" onClick={() => deleteComment(comment.id)} style={{ cursor: "pointer" }}>
                  刪除
                </li>
              )}
            </ul>
          </div>
        )}

      </div>

      {/* ✅ 只顯示回覆數量，點擊才展開 */}
      {comment.replies.length > 0 && (
      <div className="text-gray hover-effect" style={{ cursor: "pointer" }} onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? "隱藏回覆" : `查看 ${comment.replies.length} 則回覆`}
      </div>
      )}


      {/* 回覆輸入框 */}
      {showCommentReply && (
        <div
        className="input-group"
        onBlur={() => {
          setShowCommentReply(false);
        }}
      >
          <input
          type="text"
          className="form-control border-end-0 rounded-1"
          value={addReply}
          onChange={(e) => {
            setAddReply(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && addCommentRep()}
        />
        <span
          className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1"
          style={{ cursor: "pointer" }}
          onMouseDown={(e) => {
            e.preventDefault();
            addCommentRep()
          }}>
          send
          </span>
      </div>
      )}


      {/* 編輯 & 刪除按鈕 */}
      {/* <div className="d-flex gap-1">
        {comment.user_id === userId && (
          <p className="text-gray btn border  btn-click" style={{ cursor: "pointer" }} onClick={() => setIsEditing(!isEditing)}>
            編輯
          </p>
        )}
        {isAuthor && <p className="text-danger btn border  btn-click" style={{ cursor: "pointer" }} onClick={deleteComment}>刪除</p>}
      </div> */}
     
 

   
      {/* 遞迴渲染子留言 */}
      {showReplies && comment.replies.length >0 && (
         <div className="ms-4 border-start border-gray_light ps-3">
          {comment.replies.map(reply => (
              <Blog_CommentReply 
                key={reply.id} 
                comment={reply} 
                likeComment={likeComment} 
                postId= {postId}  
                getBlogArticle={getBlogArticle} 
                token={token}
                formatTimeAgo={formatTimeAgo} // ✅ 傳遞時間函式給子回覆
                isAuthor={isAuthor}  // ✅ 確保 `isAuthor` 被傳遞
                userId={userId}      // ✅ 傳遞 userId 判斷編輯權限
              />
            )
          )}
         </div>
      )}

    </div>
  );
};

Blog_CommentReply.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user_id: PropTypes.string,
    content: PropTypes.string.isRequired,
    user_name: PropTypes.string.isRequired,
    profile_picture: PropTypes.string,
    likes_count: PropTypes.string,
    replies: PropTypes.arrayOf(PropTypes.object),
    created_at: PropTypes.string
  }).isRequired,  
  likeComment: PropTypes.func, // 按讚留言
  commentLikes: PropTypes.object, // 留言按讚數對應物件
  getBlogArticle: PropTypes.func,
  token: PropTypes.string,
  postId: PropTypes.string,
  formatTimeAgo: PropTypes.func,
  isAuthor:PropTypes.bool,
  userId: PropTypes.string,
  setIsLoading: PropTypes.func
};




export default Blog_CommentReply;
