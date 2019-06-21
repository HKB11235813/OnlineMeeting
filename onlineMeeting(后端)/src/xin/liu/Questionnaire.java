package xin.liu;

public class Questionnaire {
	private int questionnaireID;
	private int totalPage;
	private int totalRecord;
	public int getTotalPage() {
		return totalPage;
	}
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}
	public int getTotalRecord() {
		return totalRecord;
	}
	public void setTotalRecord(int totalRecord) {
		this.totalRecord = totalRecord;
	}
	private String questionnaireName;
	private String createUser;
	private String createTime;
	public int getQuestionnaireID() {
		return questionnaireID;
	}
	public void setQuestionnaireID(int questionnaireID) {
		this.questionnaireID = questionnaireID;
	}
	public String getQuestionnaireName() {
		return questionnaireName;
	}
	public void setQuestionnaireName(String questionnaireName) {
		this.questionnaireName = questionnaireName;
	}
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	
}
