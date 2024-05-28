package structure

type DataKey struct {
	Id       *int    `json:"id"`
	Username string  `json:"username"`
	Password string  `json:"password"`
	Role     *string `json:"role"`
}

type QuestionKey struct {
	Id          *int   `json:"q_id"`
	Question    string `json:"question"`
	Ans1        string `json:"ans1"`
	Ans2        string `json:"ans2"`
	Ans3        string `json:"ans3"`
	Ans4        string `json:"ans4"`
	Correct_Ans string `json:"correct_ans"`
}
type AnsKey struct {
	Ans string `json:"answer"`
}
type ScoreKey struct {
	Quiz_id  *int    `json:"quiz_id"`
	Username *string `json:"username"`
	Score    int     `json:"score"`
}
type UserMessage struct {
	Id       *int   `json:"user_id"`
	Username string `json:"username"`
	Message  string `json:"message"`
}

type PdfFile struct {
	Id       *int    `json:"file_id"`
	Username string  `json:"file_by"`
	FileName *string `json:"file_name"`
	FilePath string  `json:"file_path"`
}
