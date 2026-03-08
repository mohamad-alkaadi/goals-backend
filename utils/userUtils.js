exports.getInitials = (name) => {
  return name.trim().split(/\s+/).map(word => word[0]).join('').toUpperCase().slice(0, 2)
}
