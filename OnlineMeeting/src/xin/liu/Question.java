package xin.liu;

public class Question {
	private int questionID;
	private int totalPage;
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
	private int totalRecord;
	private String questionName;
	private String questionKey;
	private String questionType;
	private String selectA;
	private String selectB;
	private String selectC;
	private String selectD;
	private String selectE;
	private String createUser;
	private String createTime;
	private String updateTime;
	public int getQuestionID() {
		return questionID;
	}
	public void setQuestionID(int questionID) {
		this.questionID = questionID;
	}
	public String getQuestionName() {
		return questionName;
	}
	public void setQuestionName(String questionName) {
		this.questionName = questionName;
	}
	public String getQuestionKey() {
		return questionKey;
	}
	public void setQuestionKey(String questionKey) {
		this.questionKey = questionKey;
	}
	public String getQuestionType() {
		return questionType;
	}
	public void setQuestionType(String questionType) {
		this.questionType = questionType;
	}
	public String getSelectA() {
		return selectA;
	}
	public void setSelectA(String selectA) {
		this.selectA = selectA;
	}
	public String getSelectB() {
		return selectB;
	}
	public void setSelectB(String selectB) {
		this.selectB = selectB;
	}
	public String getSelectC() {
		return selectC;
	}
	public void setSelectC(String selectC) {
		this.selectC = selectC;
	}
	public String getSelectD() {
		return selectD;
	}
	public void setSelectD(String selectD) {
		this.selectD = selectD;
	}
	public String getSelectE() {
		return selectE;
	}
	public void setSelectE(String selectE) {
		this.selectE = selectE;
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
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
}
