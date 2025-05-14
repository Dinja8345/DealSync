const LoadingIcon = () => {
  return (
    <div className="flex justify-center my-20">
      <div
        className="w-10 h-10 rounded-full border-4 border-blue-500 animate-spin"
        style={{ borderTopColor: "transparent" }}
      />
    </div>
  );
};

export default LoadingIcon;
