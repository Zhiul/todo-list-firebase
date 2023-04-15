import todoListIcon from "../assets/todo-list-icon.png";

export function LoadingScreen({
  showLoadingScreen,
}: {
  showLoadingScreen: boolean;
}) {
  return (
    <div className="loading-screen" data-visible={showLoadingScreen}>
      <div className="loading-screen-logo">
        <img src={todoListIcon} alt="Todolist logo" />
      </div>

      <span className="loader"></span>
    </div>
  );
}
