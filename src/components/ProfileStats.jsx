const ProfileStats = ({ posts, followers, following }) => {
  const stats = [
    { label: 'Posts', value: posts },
    { label: 'Followers', value: followers },
    { label: 'Following', value: following },
  ];

  return (
    <div className="flex items-center gap-6">
      {stats.map(({ label, value }) => (
        <div key={label} className="text-center">
          <p className="text-lg font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;