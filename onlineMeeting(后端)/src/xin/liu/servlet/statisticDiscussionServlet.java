package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.DephilAnswer;
import xin.liu.StaticDephilAnswer;

/**
 * Servlet implementation class statisticDiscussionServlet
 */
@WebServlet("/statisticDiscussionServlet")
public class statisticDiscussionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public statisticDiscussionServlet() {
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
        String discussionID = request.getParameter("discussionID");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        ArrayList<StaticDephilAnswer> staticDephilAnswerList = new ArrayList<StaticDephilAnswer>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			String sql = "select * from dephilanswer left join question on question.questionID = dephilanswer.questionID "				
						  +"where questionType!='简答' and discussionID='"+discussionID+"' order by dephilanswer.questionID";
			Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement statement = conn.createStatement();
            ResultSet rs = statement.executeQuery(sql);
            //获得结果后操作
            int currentQuestionID = 0;
            StaticDephilAnswer staticDephilAnswer = new StaticDephilAnswer();
            int[] countValue = new int[20];
	        while(rs.next()){
	        	if(rs.getInt("questionID") > currentQuestionID){
	        		currentQuestionID = rs.getInt("questionID");
	        		staticDephilAnswer.setCountValue(countValue);
	        		staticDephilAnswerList.add(staticDephilAnswer);
	        		countValue = new int[20];
	        		staticDephilAnswer = new StaticDephilAnswer();
	        		staticDephilAnswer.setQuestionID(rs.getInt("questionID"));
	        		staticDephilAnswer.setQuestionName(rs.getString("questionName"));
	        		staticDephilAnswer.setQuestionType(rs.getString("questionType"));
	        	}
	        	
	        	if(rs.getString("questionType").equals("单选")){
        			switch(rs.getString("answer")){
        				case "A": countValue[0]++;break;
        				case "B": countValue[1]++;break;
        				case "C": countValue[2]++;break;
        				case "D": countValue[3]++;break;
        			}
        			
        		}else if(rs.getString("questionType").equals("多选")){
        			switch(rs.getString("answer")){
        				case "AB": countValue[0]++;break;
        				case "AC": countValue[1]++;break;
        				case "AD": countValue[2]++;break;
        				case "AE": countValue[3]++;break;
        				case "BC": countValue[4]++;break;
        				case "BD": countValue[5]++;break;
        				case "BE": countValue[6]++;break;
        				case "CD": countValue[7]++;break;
        				case "CE": countValue[8]++;break;
        				case "DE": countValue[9]++;break;
        				case "ABC": countValue[10]++;break;
        				case "ABD": countValue[11]++;break;
        				case "ABE": countValue[12]++;break;
        				case "BCD": countValue[13]++;break;
        				case "BCE": countValue[14]++;break;
        				case "CDE": countValue[15]++;break;
        				case "ABCD": countValue[16]++;break;
        				case "ABCE": countValue[17]++;break;
        				case "BCDE": countValue[18]++;break;
        				case "ABCDE": countValue[19]++;break;
        			}
        		}
            }
	        staticDephilAnswer.setCountValue(countValue);
    		staticDephilAnswerList.add(staticDephilAnswer);
            //使用完数据库池释放
	        statement.close();
            rs.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(staticDephilAnswerList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}

}
