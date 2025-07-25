package com.demo.jwt.authify.services;

import com.demo.jwt.authify.constants.ErrorMessages;
import com.demo.jwt.authify.entity.StudentEntity;
import com.demo.jwt.authify.exceptions.AppExceptions;
import com.demo.jwt.authify.io.StudentRequest;
import com.demo.jwt.authify.repository.StudentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService{

    private final StudentRepository studentRepository;
    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addStudent(StudentRequest studentRequest, MultipartFile file) {
        StudentEntity student = convertToStudentEntity(studentRequest);
        String imageUrl = uploadStudentImage(file, null);
        student.setStudentImageUrl(imageUrl);
        studentRepository.save(student);
    }

    @Override
    public Page<StudentEntity> getAllStudents(int page, int size, String sortBy, String sortDir) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentEntity> query = cb.createQuery(StudentEntity.class);
        Root<StudentEntity> student = query.from(StudentEntity.class);

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(student.get(sortBy)));
        } else {
            query.orderBy(cb.desc(student.get(sortBy)));
        }

        List<StudentEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(StudentEntity.class)));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    @Override
    public Optional<StudentEntity> getStudent(Long id) {
        return studentRepository.findById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStudent(StudentRequest studentRequest, MultipartFile file, Long id) {
        StudentEntity existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.StudentNotFoundException(ErrorMessages.STUDENT_NOT_FOUND));

        BeanUtils.copyProperties(studentRequest, existingStudent, "admissionId", "createdAt", "updatedAt", "studentImageUrl");
        String newImageUrl = uploadStudentImage(file, existingStudent.getStudentImageUrl());
        existingStudent.setStudentImageUrl(newImageUrl);
        studentRepository.save(existingStudent);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteStudent(Long id) {
        studentRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.StudentNotFoundException(ErrorMessages.STUDENT_NOT_FOUND));
        studentRepository.deleteById(id);
    }

    @Override
    public Page<StudentEntity> searchStudents(Long admissionId, String name, Integer studentClass, Long phoneNumber,
                                              int page, int size, String sortBy, String sortDir) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentEntity> query = cb.createQuery(StudentEntity.class);
        Root<StudentEntity> student = query.from(StudentEntity.class);

        List<Predicate> predicates = buildPredicates(cb, student, admissionId, name, studentClass, phoneNumber);
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(student.get(sortBy)));
        } else {
            query.orderBy(cb.desc(student.get(sortBy)));
        }

        List<StudentEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<StudentEntity> countRoot = countQuery.from(StudentEntity.class);

        List<Predicate> countPredicates = buildPredicates(cb, countRoot, admissionId, name, studentClass, phoneNumber);

        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    @Override
    public Page<StudentEntity> getStudentsByClassAndSection(int page, int size, Integer studentClass, String section) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<StudentEntity> query = cb.createQuery(StudentEntity.class);
        Root<StudentEntity> student = query.from(StudentEntity.class);

        Predicate classPredicate = cb.equal(student.get("studentClass"), studentClass);
        Predicate sectionPredicate = cb.equal(student.get("section"), section);
        query.where(cb.and(classPredicate, sectionPredicate));

        List<StudentEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<StudentEntity> countRoot = countQuery.from(StudentEntity.class);
        countQuery.select(cb.count(countRoot));
        countQuery.where(cb.and(
                cb.equal(countRoot.get("studentClass"), studentClass),
                cb.equal(countRoot.get("section"), section)
        ));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<StudentEntity> root,
                                            Long admissionId, String name, Integer studentClass, Long phoneNumber) {
        List<Predicate> predicates = new ArrayList<>();

        if (admissionId != null) {
            predicates.add(cb.equal(root.get("admissionId"), admissionId));
        }
        if (name != null && !name.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if (studentClass != null) {
            predicates.add(cb.equal(root.get("studentClass"), studentClass));
        }
        if (phoneNumber != null) {
            predicates.add(cb.like(
                    cb.function("str", String.class, root.get("phoneNumber")), "%" + phoneNumber + "%"
            ));
        }

        return predicates;
    }

    private String uploadStudentImage(MultipartFile file, String oldImageUrlIfAny) {
        if (file == null || file.isEmpty()) {
            return oldImageUrlIfAny;
        }
        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new AppExceptions.InvalidImageFileException(ErrorMessages.NOT_IMAGE_FILE);
            }
            if (oldImageUrlIfAny != null && !oldImageUrlIfAny.isBlank()) {
                Path oldFilePath = Paths.get("uploads", "student_photos", Paths.get(oldImageUrlIfAny).getFileName().toString());
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException ex) {
                    System.err.println("⚠️ Failed to delete old image: " + ex.getMessage());
                }
            }
            String uploadPath = "uploads/student_photos/";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String originalFileName = Optional.ofNullable(file.getOriginalFilename())
                    .orElseThrow(() -> new AppExceptions.InvalidFileException(ErrorMessages.MISSING_IMAGE_NAME))
                    .replaceAll("\\s+", "_");

            String filename = UUID.randomUUID() + "_" + originalFileName;
            Path filepath = Paths.get(uploadPath, filename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/student_photos/" + filename;
        } catch (IOException e) {
            throw new AppExceptions.ImageUploadFailureException(ErrorMessages.IMAGE_UPLOAD_FAILURE);
        }
    }

    private StudentEntity convertToStudentEntity(StudentRequest studentRequest) {
        return StudentEntity.builder()
                .name(studentRequest.getName())
                .email(studentRequest.getEmail())
                .dob(studentRequest.getDob())
                .fatherName(studentRequest.getFatherName())
                .fatherOccupation(studentRequest.getFatherOccupation())
                .motherName(studentRequest.getMotherName())
                .motherOccupation(studentRequest.getMotherOccupation())
                .gender(studentRequest.getGender())
                .phoneNumber(studentRequest.getPhoneNumber())
                .address(studentRequest.getAddress())
                .studentClass(studentRequest.getStudentClass())
                .section(studentRequest.getSection())
                .religion(studentRequest.getReligion())
                .bloodGroup(studentRequest.getBloodGroup())
                .studentImageUrl(null)
                .build();
    }
}
