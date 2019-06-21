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
import xin.liu.Question;

/**
 * Servlet implementation class lookQuestionnaireServlet
 */
@WebServlet("/lookQuestionnaireServlet")
public class lookQuestionnaireServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public lookQuestionnaireServlet() {
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
        String questionnaireID = request.getParameter("questionnaireID");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        ArrayList<Question> questionList = new ArrayList<Question>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			String sql = "select * from question_questionnaire left join "
					+ "question on question_questionnaire.questionID=question.questionID "
					+ "where questionnaireID='"+questionnaireID+"'";	    
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement statement = conn.createStatement();
            ResultSet rs = statement.executeQuery(sql);
            //获得结果后操作
	        while(rs.next()){
	        	Question question = new Question();
	        	question.setQuestionID(rs.getInt("questionID"));
	        	question.setQuestionName(rs.getString("questionName"));
	        	question.setQuestionKey(rs.getString("questionKey"));
	        	question.setQuestionType(rs.getString("questionType"));
	        	question.setSelectA(rs.getString("selectA"));
	        	question.setSelectB(rs.getString("selectB"));
	        	question.setSelectC(rs.getString("selectC"));
	        	question.setSelectD(rs.getString("selectD"));
	        	question.setSelectE(rs.getString("selectE"));
	        	questionList.add(question);
            }
            //使用完数据库池释放
	        statement.close();
            rs.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(questionList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}
}
