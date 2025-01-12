export const createFolderFromTemplate = (template) => {
  const newPlaylist = {
    id: Date.now().toString(),
    name: template.name,
    description: template.description,
    createdAt: new Date().toISOString(),
    timers: [],
  };

  const newTimers = template.timers.map(timer => ({
    ...timer,
    id: `${newPlaylist.id}_${timer.id}`,
    createdAt: newPlaylist.createdAt,
    folderId: newPlaylist.id
  }));

  return { playlist: newPlaylist, timers: newTimers };
}; 