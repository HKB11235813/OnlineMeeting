package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.Question;

/**
 * Servlet implementation class addDiscussionServlet
 */
@WebServlet("/addDiscussionServlet")
public class addDiscussionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public addDiscussionServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//设置字符编码集
		response.addHeader("Access-Control-Allow-Origin","*");
        request.setCharacterEncoding("utf-8");
        //获取前台传来的数据请求，name为要查询的数据表
        int meetingID = Integer.parseInt(request.getParameter("meetingID"));
        String questionnaireID = request.getParameter("questionnaireID");
        String swotID = request.getParameter("swotID");
        String competeHypothesID = request.getParameter("competeHypothesID");
        String discussionType = request.getParameter("discussionType");
        String discussionName = request.getParameter("discussionName");
        if(questionnaireID==""){
        	questionnaireID=null;
        }
        if(competeHypothesID==""){
        	competeHypothesID=null;
        }
        if(swotID==""){
        	swotID=null;
        }
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String addResultFrontMeesage = "";
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//判断是否存在此用户
	        String sqlCount = "select * from discussion order by discussionID desc";
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement stmt = conn.createStatement();
	        Statement stateInsert = conn.createStatement();
	        //先获取questionID
        	ResultSet resultCount = stmt.executeQuery(sqlCount);
	        int discussionID = 0;
	        if(resultCount.next()){
	        	discussionID = resultCount.getInt(1);
	        	discussionID++;
            }
	        //开始添加发布的议题
	        String sqlInsert = "insert into discussion values ('"+discussionID+"', '"+meetingID+"', '"
	        					+discussionType+"', '"+discussionName+"', "+questionnaireID+", "
	        					+swotID+", "+competeHypothesID+")";
	        stateInsert.executeUpdate(sqlInsert);
	        addResultFrontMeesage = "发布议题成功!";     
	        //使用完数据库池释放
	        resultCount.close();
	        stmt.close();
	        stateInsert.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		//判断完后传数据给前端
		Gson gson1 = new Gson();
		String json = gson1.toJson(addResultFrontMeesage);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}

}
